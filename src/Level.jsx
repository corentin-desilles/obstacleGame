import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState, useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF } from '@react-three/drei'
import { useAudio } from './stores/useAudio'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

export function BlockStart({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <Float floatIntensity={0.25} rotationIntensity={0.25}>
                <Text
                    font="./bebas-neue-v9-latin-regular.woff"
                    scale={0.4}
                    maxWidth={0.25}
                    lineHeight={0.8}
                    textAlign="center"
                    position={[1, 0.75, 0]}
                    rotation-y={-0.5}
                >
                    Bouboule qui Rouroule
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>

            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />
        </group>
    )
}

export function BlockEnd({ position = [0, 0, 0] }) {
    const trophy = useGLTF('./trophy.glb')

    //To activate shadows on the model we use forEach  and the the castShadow to true since the scene only contins meshes.
    trophy.scene.children.forEach(mesh => {
        mesh.castShadow = true
    })

    return (
        <group position={position}>
            <Text
                font="./bebas-neue-v9-latin-regular.woff"
                scale={1}
                position={[0, 2.25, 2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} />
            </Text>

            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                position={[0, 0, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            {/* Finish Line model */}
            <RigidBody
                type="fixed"
                colliders="hull"
                position={[0, 0.4, 0]}
                restitution={0.2}
                friction={0}
            >
                <primitive object={trophy.scene} scale={0.6} />
            </RigidBody>
        </group>
    )
}

export function BlockSpinner({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [speed] = useState(
        () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
    ) //get random value for rotation speed and rotation direction

    //get the time spent since the experience start and use it as the angle to rotate the obstacle
    useFrame(state => {
        const time = state.clock.getElapsedTime()
        //Simple rotation so we just convert the Quartenion in Euler.
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    const audio = useAudio(state => state.audio)
    const hitSound = useMemo(() => new Audio('./sounds/jumpland48000.mp3'), [])

    function onHit({ totalForceMagnitude }) {
        hitSound.currentTime = 0
        hitSound.volume = Math.min(totalForceMagnitude / 500, 1)
        hitSound.play()
    }

    useEffect(() => {
        hitSound.muted = !audio
    }, [audio])

    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            {/* Spinner Obstacle */}
            <RigidBody
                ref={obstacle} //Animate the obstacle
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2} //for a slight bounce
                friction={0} //without rubbing too much against the floor
                onContactForce={onHit}
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
    )
}

export function BlockLimbo({ position = [0, 0, 0] }) {
    const obstacle = useRef()

    //Offset animation in time to avoid having the Limbo obstacles having identical animation. We want the same speed but not at the same time. We use "2 * PI" to offset the sinus.
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame(state => {
        const time = state.clock.getElapsedTime()

        //We want the obstacle to go up and down so we use Math.sin() to get a value that go up and down between 1 and -1, we send it the time and then tweak the value so it's above the floor.
        const y = Math.sin(time + timeOffset) + 1.15
        //We use the position prop to make sure the group move all together
        obstacle.current.setNextKinematicTranslation({
            x: position[0],
            y: position[1] + y,
            z: position[2],
        })
    })

    const audio = useAudio(state => state.audio)
    const hitSound = useMemo(() => new Audio('./sounds/jumpland48000.mp3'), [])

    function onHit({ totalForceMagnitude }) {
        hitSound.currentTime = 0
        hitSound.volume = Math.min(totalForceMagnitude / 500, 1)
        hitSound.play()
    }

    useEffect(() => {
        hitSound.muted = !audio
    }, [audio])

    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                receiveShadow
            />

            {/* Limbo Obstacle */}
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
                onContactForce={onHit}
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
    )
}

export function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    useFrame(state => {
        const time = state.clock.getElapsedTime()

        //Increase amplitude of Math.sin() by multiplying it by 1.25 so that the obstacle moves from side to side
        const x = Math.sin(time + timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({
            x: position[0] + x,
            y: position[1] + 0.75,
            z: position[2],
        })
    })

    const audio = useAudio(state => state.audio)
    const hitSound = useMemo(() => new Audio('./sounds/jumpland48000.mp3'), [])

    function onHit({ totalForceMagnitude }) {
        hitSound.currentTime = 0
        hitSound.volume = Math.min(totalForceMagnitude / 500, 1)
        hitSound.play()
    }

    useEffect(() => {
        hitSound.muted = !audio
    }, [audio])

    return (
        <group position={position}>
            {/* Floor */}
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                position={[0, -0.1, 0]}
                scale={[4, 0.2, 4]}
                castShadow
                receiveShadow
            />

            {/* Axe Obstacle */}
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}
                onContactForce={onHit}
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
    )
}

function Bounds({ length = 1 }) {
    //We want to be able to control the length of the walls from an attribute. The length of the lvl is defined by the "count" value (amount of traps) in the "level" function so we will use this value.

    // const audio = useAudio(state => state.audio)
    // const hitSound = useMemo(() => new Audio('./sounds/jumpland48000.mp3'), [])

    // function onHit({ totalForceMagnitude }) {
    //     hitSound.currentTime = 0
    //     hitSound.volume = Math.min(totalForceMagnitude / 10000, 1)
    //     hitSound.play()
    // }

    // useEffect(() => {
    //     hitSound.muted = !audio
    // }, [audio])
    return (
        <>
            {/* We can wrap all the meshes in 1 RigidBody bcs react-three/rapier will create 1 collider for each one */}
            <RigidBody
                type="fixed"
                restitution={0.2}
                friction={0}
                // onContactForce={onHit}
            >
                {/* Right wall */}
                <mesh
                    //Don't ask me why this formula, just put random values until it works.
                    position={[2.15, 0.75, -(length * 2) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    // depth value (z) = 4 * length beacause each obstacle block is 4 units long
                    scale={[0.3, 1.5, 4 * length]}
                    castShadow
                />

                {/* Left wall, we duplicate right wall mesh and invert its x position. Also, replace castShadow by receiveShadow */}
                <mesh
                    position={[-2.15, 0.75, -(length * 2) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[0.3, 1.5, 4 * length]}
                    receiveShadow
                />

                {/* Back wall */}
                <mesh
                    position={[0, 0.75, -(length * 4) + 2]}
                    geometry={boxGeometry}
                    material={wallMaterial}
                    scale={[4, 1.5, 0.3]}
                    receiveShadow
                />

                {/* Collider for the floor so the player doesn't fall through it, we scale and move it so it covers the whole floor */}
                <CuboidCollider
                    type="fixed"
                    args={[2, 0.1, 2 * length]}
                    position={[0, -0.1, -(length * 2) + 2]}
                    restitution={0.2}
                    //friction value to 1 so when we rotate the ball it will move forward
                    friction={1}
                />
            </RigidBody>
        </>
    )
}

export function Level({
    count = 5,
    types = [BlockSpinner, BlockAxe, BlockLimbo],
    seed = 0,
}) {
    const blocks = useMemo(() => {
        const blocks = []

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        return blocks
    }, [count, types, seed])

    return (
        <>
            <BlockStart position={[0, 0, 0]} />
            {blocks.map((Block, index) => (
                <Block key={index} position={[0, 0, -(index + 1) * 4]} />
            ))}
            <BlockEnd position={[0, 0, -(count + 1) * 4]} />
            <Bounds length={count + 2} />{' '}
            {/* We add 2 to count bcz there is also start and end blocks */}
        </>
    )
}
