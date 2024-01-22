import { RigidBody } from "@react-three/rapier"

export default function Player() {

   
    return <>
    <RigidBody
        canSleep={false}
        position={[0, 1, 0]}
        colliders="ball"
        restitution={0.2}
        friction={1}
    >
        <mesh
            castShadow
        >
        {/* icosahedronGeometry to get a sphere with the triangles having near the same size  */}
            <icosahedronGeometry args={ [0.3, 1]} />
            <meshStandardMaterial 
                flatShading 
                color='mediumpurple'
            />
        </mesh>
    </RigidBody>
    </>

}