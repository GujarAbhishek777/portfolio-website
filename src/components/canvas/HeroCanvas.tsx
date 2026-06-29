import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, MeshDistortMaterial } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

// Light source that dynamically tracks the cursor coordinates
function CursorLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame((state) => {
    const { pointer } = state
    if (lightRef.current) {
      // Smoothly interpolate the light position to match the cursor
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, pointer.x * 6, 0.1)
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, pointer.y * 6, 0.1)
    }
  })

  return (
    <directionalLight
      ref={lightRef}
      position={[0, 0, 5]}
      intensity={3}
      color="#00f2fe"
    />
  )
}

// Immersive 3D floating shape with wireframe and glass distortion
function AntiGravityShape() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const { pointer } = state

    if (meshRef.current && wireRef.current) {
      // Weightless floating effect along the Y-axis
      const floatOffsetY = Math.sin(time * 1.2) * 0.15
      meshRef.current.position.y = floatOffsetY
      wireRef.current.position.y = floatOffsetY

      // Slow self-rotation
      meshRef.current.rotation.x = time * 0.15
      meshRef.current.rotation.y = time * 0.2
      wireRef.current.rotation.x = time * 0.15
      wireRef.current.rotation.y = time * 0.2

      // Cursor parallax reactiveness
      meshRef.current.rotation.x += pointer.y * 0.1
      meshRef.current.rotation.y += pointer.x * 0.1
      wireRef.current.rotation.x += pointer.y * 0.1
      wireRef.current.rotation.y += pointer.x * 0.1
    }
  })

  return (
    <group>
      {/* Outer Neon Wireframe Sphere */}
      <mesh ref={wireRef} scale={1.6}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial 
          color="#9b51e0" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>

      {/* Core Glowing Metallic Glass Sphere */}
      <mesh ref={meshRef} scale={1.2}>
        <torusKnotGeometry args={[0.5, 0.2, 120, 16]} />
        <MeshDistortMaterial
          color="#0d0e18"
          roughness={0.1}
          metalness={0.9}
          distort={0.4}
          speed={2}
          bumpScale={0.05}
        />
      </mesh>
    </group>
  )
}

export default function HeroCanvas() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10 bg-dark-bg">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        
        {/* Cursor following light source */}
        <CursorLight />

        {/* Ambient background particles */}
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={1.5}
        />

        <Suspense fallback={null}>
          <AntiGravityShape />
        </Suspense>

        {/* Soft blue secondary light from bottom-left */}
        <directionalLight position={[-4, -4, -2]} intensity={1.5} color="#bd00ff" />
        {/* Soft teal highlight from top-right */}
        <directionalLight position={[4, 4, 2]} intensity={2.0} color="#00f5d4" />

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
