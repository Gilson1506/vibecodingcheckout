import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import multicaixaLogo from "@/assets/multicaixa.png";
import expressLogo from "@/assets/express.png";
import { createAppyPayCharge, formatPaymentReference } from "@/lib/appyPayService";

// Get API URL from env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface CheckoutFormProps {
  coursePrice: number;
  courseName: string;
  whatsappNumber: string;
}

export function CheckoutForm({ coursePrice, courseName, whatsappNumber }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    multicaixaPhone: "",
    paymentMethod: "multicaixa" as "multicaixa" | "referencia",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false); // Controls the 2-step flow for Multicaixa
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(120); // Updated to 120s
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState<{ orderId: string; referenceNumber: string; entity?: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // SSE (Server-Sent Events) for real-time payment status updates
  useEffect(() => {
    if (showCountdown && paymentId) {
      console.log('🔔 Starting SSE subscription for payment:', paymentId);

      // Connect to SSE endpoint
      const eventSource = new EventSource(`${API_URL}/api/payments/subscribe/${paymentId}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('📡 SSE: Connected to payment stream');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 SSE: Received event:', data);

          if (data.type === 'status' || data.type === 'final') {
            const status = data.status;

            if (status === 'completed' || status === 'confirmed') {
              console.log('✅ Payment confirmed via SSE!');
              handlePaymentSuccess(data.payment);
              eventSource.close();
            } else if (status === 'failed' || status === 'cancelled') {
              console.log('❌ Payment failed via SSE');
              toast.error("Pagamento falhou ou foi cancelado.");
              setShowCountdown(false);
              eventSource.close();
            }
          }
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      };

      eventSource.onerror = (error) => {
        console.error('📡 SSE: Error', error);
        // Don't close on error - let it reconnect automatically
      };

      return () => {
        console.log('🔕 SSE: Closing connection');
        eventSource.close();
      };
    }
  }, [showCountdown, paymentId]);

  // Countdown timer only
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showCountdown && countdownValue > 0) {
      interval = setInterval(() => {
        setCountdownValue((prev) => prev - 1);
      }, 1000);
    } else if (countdownValue === 0 && showCountdown) {
      // Timeout - do one final check before showing error
      toast.error("Tempo esgotado para pagamento.");
      setShowCountdown(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [showCountdown, countdownValue]);

  const handlePaymentSuccess = (paymentData: any) => {
    setShowCountdown(false);
    setOrderCreated({
      orderId: paymentData.external_id || "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      referenceNumber: paymentData.reference_code || "N/A",
      entity: paymentData.metadata?.entity
    });
    toast.success("Pagamento confirmado com sucesso!");
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === "multicaixa") {
      setIsPaymentStarted(true);
    } else {
      // Direct reference flow
      initiatePayment("referencia");
    }
  };

  const initiatePayment = async (method: 'multicaixa' | 'referencia') => {
    setIsSubmitting(true);
    try {
      const payload = {
        amount: coursePrice,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        paymentMethod: method,
        multicaixaPhone: method === 'multicaixa' ? formData.multicaixaPhone : undefined
      };

      const response = await createAppyPayCharge(payload);

      if (response.paymentId) {
        setPaymentId(response.paymentId);

        if (method === 'referencia') {
          const ref = response.appyResponse?.responseStatus?.reference;
          if (ref) {
            setOrderCreated({
              orderId: response.merchantTransactionId,
              referenceNumber: ref.referenceNumber || ref.reference || 'Pendente',
              entity: ref.entity
            });
            toast.success("Referência gerada com sucesso!");
          } else {
            toast.error("Erro ao obter referência. Tente novamente.");
          }
        } else {
          // Multicaixa Express - Start Countdown
          setShowCountdown(true);
          setCountdownValue(60); // 60 segundos
          toast.success("Solicitação enviada para o seu telemóvel!");
        }
      }

    } catch (error: any) {
      toast.error(error.message || "Erro ao iniciar pagamento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalizeMulticaixa = async () => {
    if (!formData.multicaixaPhone) {
      toast.error("Por favor, insira o número do Multicaixa Express.");
      return;
    }
    initiatePayment("multicaixa");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Success View - Final State
  if (orderCreated) {
    const isReference = formData.paymentMethod === 'referencia';

    return (
      <Card className="w-full max-w-md mx-auto border-sky-100 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center animate-bounce duration-[2000ms]">
              <CheckCircle2 className="w-10 h-10 text-sky-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {isReference ? "Referência Gerada!" : "Pagamento Confirmado!"}
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 mt-2">
            {isReference
              ? "Utilize os dados abaixo para efetuar o pagamento."
              : "Verifique o seu email para ver os dados de acesso ao curso."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">

          {isReference ? (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Entidade</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white p-3 rounded-lg border border-slate-200 font-mono text-lg font-bold text-slate-800">
                    {orderCreated.entity || "00123"}
                  </code>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(orderCreated.entity || "00123", "entity")} className="shrink-0">
                    {copiedField === "entity" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Referência</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white p-3 rounded-lg border border-slate-200 font-mono text-lg font-bold text-slate-800">
                    {orderCreated.referenceNumber}
                  </code>
                  <Button size="icon" variant="outline" onClick={() => copyToClipboard(orderCreated.referenceNumber, "reference")} className="shrink-0">
                    {copiedField === "reference" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 mt-2">
                <p className="text-sm text-slate-500 text-center">
                  Pague em qualquer ATM ou use pagamentos por referência no app Multicaixa Express
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
              <p className="text-sm text-slate-500 mb-1">Comprovativo</p>
              <p className="font-mono font-bold text-slate-800 text-lg">{orderCreated.referenceNumber}</p>
            </div>
          )}

          <Button
            onClick={() => {
              setOrderCreated(null);
              setIsPaymentStarted(false);
              setShowCountdown(false);
              setPaymentId(null);
              setFormData({
                customerName: "",
                customerEmail: "",
                customerPhone: "",
                multicaixaPhone: "",
                paymentMethod: "multicaixa",
              });
            }}
            variant="outline"
            className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 py-6"
          >
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Countdown Overlay Component
  if (showCountdown) {
    // Increased radius size
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const maxTime = 60; // 60 seconds
    const offset = circumference - ((maxTime - countdownValue) / maxTime) * circumference;

    return (
      <Card className="w-full max-w-md mx-auto border-sky-100 bg-white shadow-xl relative overflow-hidden">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">Aguardando Pagamento</h3>
            <p className="text-slate-500">Acesse ao app Multicaixa Express e finalize a compra</p>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="128"
                cy="128"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="text-sky-500 transition-all duration-1000 ease-linear"
              />
            </svg>
            {/* Logo in Center */}
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <img src={expressLogo} alt="MCX" className="w-full h-full object-contain opacity-90" />
            </div>
          </div>

          <div className="text-5xl font-mono font-bold text-slate-700">
            {Math.floor(countdownValue / 60)}:{String(countdownValue % 60).padStart(2, '0')}
          </div>

          <Button variant="ghost" className="text-slate-400 hover:text-red-500" onClick={() => setShowCountdown(false)}>
            Cancelar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-sky-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-800">Finalizar Compra</CardTitle>
        <CardDescription className="text-slate-500">{courseName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          {/* User Info Fields */}
          {!isPaymentStarted && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-slate-600">Nome Completo</Label>
                <Input id="customerName" name="customerName" placeholder="João Silva" value={formData.customerName} onChange={handleInputChange} required className="border-slate-200 focus:ring-sky-500 focus:border-sky-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-slate-600">Email</Label>
                <Input id="customerEmail" name="customerEmail" type="email" placeholder="seu@email.com" value={formData.customerEmail} onChange={handleInputChange} required className="border-slate-200 focus:ring-sky-500 focus:border-sky-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-slate-600">Telefone (WhatsApp)</Label>
                <Input id="customerPhone" name="customerPhone" type="tel" placeholder="+244923456789" value={formData.customerPhone} onChange={handleInputChange} required className="border-slate-200 focus:ring-sky-500 focus:border-sky-500" />
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-4">
            {!isPaymentStarted ? (
              <>
                <Label className="text-slate-800 text-base font-semibold">Método de Pagamento</Label>
                <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value as "multicaixa" | "referencia" }))}>
                  <div className={`flex items-center space-x-4 p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'multicaixa' ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <RadioGroupItem value="multicaixa" id="multicaixa" className="text-sky-500 border-slate-300" />
                    <Label htmlFor="multicaixa" className="cursor-pointer flex-1 font-semibold text-lg flex items-center justify-between text-slate-700">
                      <span>Multicaixa Express</span>
                      <img src={expressLogo} alt="Multicaixa Express" className="h-8 md:h-10 object-contain" />
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-4 p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'referencia' ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <RadioGroupItem value="referencia" id="referencia" className="text-sky-500 border-slate-300" />
                    <Label htmlFor="referencia" className="cursor-pointer flex-1 font-semibold text-lg flex items-center justify-between text-slate-700">
                      <span>Pagamento por Referência</span>
                      <img src={multicaixaLogo} alt="Multicaixa" className="h-8 md:h-10 object-contain" />
                    </Label>
                  </div>
                </RadioGroup>
              </>
            ) : (
              // Step 2: Confirmation / Input for Multicaixa
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-sky-50 p-4 rounded-lg flex items-center justify-between border border-sky-100">
                  <div className="flex items-center gap-3">
                    <img src={expressLogo} className="h-8 object-contain" />
                    <span className="font-semibold text-slate-700">Multicaixa Express</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsPaymentStarted(false)} className="text-sky-600 hover:text-sky-700 hover:bg-sky-100">Alterar</Button>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="multicaixaPhone" className="text-base font-medium text-slate-700">
                    Digite o número do seu Multicaixa Express
                  </Label>
                  <Input
                    id="multicaixaPhone"
                    name="multicaixaPhone"
                    type="tel"
                    autoFocus
                    placeholder="923 000 000"
                    value={formData.multicaixaPhone}
                    onChange={handleInputChange}
                    className="text-lg py-6 border-slate-300 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <p className="text-sm text-slate-500">
                    Enviaremos uma solicitação de pagamento para este número.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          {!isPaymentStarted && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600">Total a Pagar:</span>
                <span className="text-xl font-bold text-sky-600">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(coursePrice)}
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isPaymentStarted ? (
            <Button
              type="submit"
              disabled={!formData.customerName || !formData.customerEmail || !formData.customerPhone || isSubmitting}
              className="w-full bg-sky-500 text-white hover:bg-sky-600 font-bold text-lg py-6 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Continuar"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalizeMulticaixa}
              disabled={!formData.multicaixaPhone || isSubmitting}
              className="w-full bg-sky-500 text-white hover:bg-sky-600 font-bold text-lg py-6 rounded-xl shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] mt-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Finalizar Compra"}
            </Button>
          )}

          <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
            <Loader2 className="w-3 h-3" /> Ambiente seguro e criptografado
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
