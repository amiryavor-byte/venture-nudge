'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarRendererProps {
    isRecording?: boolean;
    audioLevel?: number;
}

function AvatarHead({ isRecording, audioLevel = 0 }: AvatarRendererProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

    // Animate based on audio level (lip-sync simulation)
    useFrame((state) => {
        if (!meshRef.current) return;

        // Gentle floating animation
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

        // Scale mouth based on audio level
        const mouthScale = 1 + (audioLevel * 0.3);
        meshRef.current.scale.y = THREE.MathUtils.lerp(
            meshRef.current.scale.y,
            mouthScale,
            0.1
        );

        // Glow effect when speaking
        if (materialRef.current) {
            const targetEmissiveIntensity = isRecording ? 0.3 + (audioLevel * 0.5) : 0.1;
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
                materialRef.current.emissiveIntensity,
                targetEmissiveIntensity,
                0.1
            );
        }
    });

    return (
        <group>
            {/* Main head sphere */}
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    ref={materialRef}
                    color="#6366f1"
                    emissive="#4f46e5"
                    emissiveIntensity={0.1}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Eyes */}
            <mesh position={[-0.3, 0.2, 0.8]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={isRecording ? 0.5 : 0.2} />
            </mesh>
            <mesh position={[0.3, 0.2, 0.8]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={isRecording ? 0.5 : 0.2} />
            </mesh>

            {/* Mouth indicator */}
            <mesh position={[0, -0.3, 0.85]} scale={[0.5, 0.15, 0.1]}>
                <boxGeometry />
                <meshStandardMaterial
                    color={isRecording ? "#10b981" : "#6366f1"}
                    emissive={isRecording ? "#10b981" : "#4f46e5"}
                    emissiveIntensity={isRecording ? 0.8 : 0.3}
                />
            </mesh>
        </group>
    );
}

export function AvatarRenderer({ isRecording = false, audioLevel = 0 }: AvatarRendererProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                className="bg-transparent"
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />

                <AvatarHead isRecording={isRecording} audioLevel={audioLevel} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                    autoRotate={!isRecording}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
