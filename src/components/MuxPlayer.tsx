import { useEffect, useRef } from 'react';

interface MuxPlayerProps {
    playbackId: string;
    title?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    className?: string;
}

/**
 * Mux Video Player Component
 * Uses the Mux player for optimized video playback
 */
export function MuxPlayer({
    playbackId,
    title = 'Video',
    autoPlay = true,
    muted = true,
    loop = false,
    className = '',
}: MuxPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Auto-play when component mounts (browser requires muted for autoplay)
        if (videoRef.current && autoPlay) {
            videoRef.current.play().catch(() => {
                // Autoplay blocked by browser, that's okay
            });
        }
    }, [autoPlay]);

    // Mux provides HLS stream URL
    const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;

    // Poster image from Mux
    const posterUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0`;

    return (
        <div className={`relative w-full ${className}`} style={{ paddingBottom: '56.25%' }}>
            <video
                ref={videoRef}
                className="absolute top-0 left-0 w-full h-full rounded-2xl object-cover"
                poster={posterUrl}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                playsInline
                controls
                title={title}
            >
                {/* Native HLS support for Safari */}
                <source src={streamUrl} type="application/x-mpegURL" />
                {/* Fallback MP4 for older browsers */}
                <source src={`https://stream.mux.com/${playbackId}/high.mp4`} type="video/mp4" />
                Seu navegador não suporta vídeo HTML5.
            </video>
        </div>
    );
}

export default MuxPlayer;
