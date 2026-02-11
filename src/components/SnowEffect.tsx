import { useEffect, useRef } from 'react';

export default function SnowEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.parentElement?.clientWidth || window.innerWidth;
        let height = canvas.parentElement?.clientHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const snowflakes: { x: number; y: number; r: number; d: number; speed: number }[] = [];

        // Create snowflakes with varied sizes (small to large)
        for (let i = 0; i < 75; i++) {
            const radius = Math.random() * 6 + 2; // Radius between 2 and 8
            snowflakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: radius,
                d: Math.random() * 75, // Density/Sway factor
                speed: (Math.random() * 1 + 0.5) + (radius * 0.1), // Speed correlated with size/random
            });
        }

        function draw() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Reduced opacity for section background
            ctx.beginPath();

            for (let i = 0; i < snowflakes.length; i++) {
                const f = snowflakes[i];
                ctx.moveTo(f.x, f.y);
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
            }
            ctx.fill();
            update();
            requestAnimationFrame(draw);
        }

        let angle = 0;
        function update() {
            angle += 0.005; // Slower sway
            for (let i = 0; i < snowflakes.length; i++) {
                const f = snowflakes[i];

                // Update coordinates
                f.y += f.speed; // Use pre-calculated speed
                f.x += Math.sin(angle + f.d) * 0.5; // Gentle sway based on density

                // Reset if out of view
                if (f.y > height) {
                    // Respawn at top with random X
                    snowflakes[i].y = -10;
                    snowflakes[i].x = Math.random() * width;
                }

                // Wrap around horizontal edges
                if (f.x > width + 10) {
                    snowflakes[i].x = -10;
                } else if (f.x < -10) {
                    snowflakes[i].x = width + 10;
                }
            }
        }

        const handleResize = () => {
            width = canvas.parentElement?.clientWidth || window.innerWidth;
            height = canvas.parentElement?.clientHeight || window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        const animationId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
}
