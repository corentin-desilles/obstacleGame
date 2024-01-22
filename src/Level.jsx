import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

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

        {/* FirstObsrtacle */}
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

export default function Level() {
    return <>
        <BlockStart position={ [ 0, 0, 4 ] } />
        <BlockSpinner position={ [0, 0, 0] } />
    </>
}