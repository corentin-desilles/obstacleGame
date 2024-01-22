import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1,1,1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

function BlockStart({ position = [0, 0, 0] })
{
    return <group position={position}>

        {/* Floor */}
        <mesh 
            geometry={boxGeometry} 
            material={floor1Material}
            position={ [ 0, - 0.1, 0 ] } 
            scale={[4, 0.2, 4]} 
            receiveShadow
        />

    </group>
}


function BlockEnd({ position = [0, 0, 0] })
{
    const hamburger = useGLTF('./hamburger.glb')

    //To activate shadows on the model we use forEach  and the the castShadow to true since the scene only contins meshes.
    hamburger.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    return <group position={position}>

        {/* Floor */}
        <mesh 
            geometry={boxGeometry} 
            material={floor1Material}
            position={ [ 0, 0, 0 ] } 
            scale={[4, 0.2, 4]} 
            receiveShadow
        />

        {/* Finish Line model */}
        <RigidBody 
            type='fixed' 
            colliders='hull'
            position={[0, 0.25, 0]}
            restitution={0.2}
            friction={0}
        >
                <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
    </group>
}


function BlockSpinner({ position = [0, 0, 0] })
{

    const obstacle = useRef()
    const [speed] = useState(() => (Math.random() +0.2) * (Math.random() < 0.5 ? - 1 : 1) ) //get random value for rotation speed and rotation direction

    //get the time spent since the experience start and use it as the angle to rotate the obstacle
    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()
        //Simple rotation so we just convert the Quartenion in Euler.
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={position}>

        {/* Floor */}
        <mesh 
            geometry={boxGeometry} 
            material={floor2Material}
            position={ [ 0, - 0.1, 0 ] } 
            scale={[4, 0.2, 4]} 
            receiveShadow
        />

        {/* Spinner Obstacle */}
        <RigidBody 
            ref={obstacle} //Animate the obstacle
            type='kinematicPosition' 
            position={[0, 0.3, 0]}
            restitution={0.2} //for a slight bounce
            friction={0} //without rubbing too much against the floor
        >
                <mesh 
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
        </RigidBody>

    </group>
}


function BlockLimbo({ position = [0, 0, 0] })
{
    const obstacle = useRef()

    //Offset animation in time to avoid having the Limbo obstacles having identical animation. We want the same speed but not at the same time. We use "2 * PI" to offset the sinus.
    const [timeOffset] = useState(() => Math.random()  * Math.PI * 2 )

    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()
        
        //We want the obstacle to go up and down so we use Math.sin() to get a value that go up and down between 1 and -1, we send it the time and then tweak the value so it's above the floor.
        const y = Math.sin(time) + 1.15
        //We use the position prop to make sure the group move all together
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1]+ y, z: position[2] })

    })

    return <group position={position}>

        {/* Floor */}
        <mesh 
            geometry={boxGeometry} 
            material={floor2Material}
            position={ [ 0, - 0.1, 0 ] } 
            scale={[4, 0.2, 4]} 
            receiveShadow
        />

        {/* Limbo Obstacle */}
        <RigidBody 
            ref={obstacle} 
            type='kinematicPosition' 
            position={[0, 0.3, 0]}
            restitution={0.2} 
            friction={0} 
        >
                <mesh 
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
        </RigidBody>

    </group>
}


function BlockAxe({ position = [0, 0, 0] })
{
    const obstacle = useRef()

    const [timeOffset] = useState(() => Math.random()  * Math.PI * 2 )

    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()
        
        //Increase amplitude of Math.sin() by multiplying it by 1.25 so that the obstacle moves from side to side
        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })

    })

    return <group position={position}>

        {/* Floor */}
        <mesh 
            geometry={boxGeometry} 
            material={floor2Material}
            position={ [ 0, - 0.1, 0 ] } 
            scale={[4, 0.2, 4]} 
            receiveShadow
        />

        {/* Limbo Obstacle */}
        <RigidBody 
            ref={obstacle} 
            type='kinematicPosition' 
            position={[0, 0.3, 0]}
            restitution={0.2} 
            friction={0} 
        >
                <mesh 
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[1.5, 1.5, 0.3]}
                    castShadow
                    receiveShadow
                />
        </RigidBody>

    </group>
}


export default function Level() {
    return <>
        <BlockStart position={ [ 0, 0, 16 ] } />
        <BlockSpinner position={ [0, 0, 12] } />
        <BlockLimbo position={ [ 0, 0, 8 ] } />
        <BlockAxe position={ [ 0, 0, 4 ] } />
        <BlockEnd position={ [ 0, 0, 0 ] } />

    </>
}