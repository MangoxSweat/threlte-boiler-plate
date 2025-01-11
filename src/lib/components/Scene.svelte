<script>
	import { T } from '@threlte/core';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';
</script>

<T.PerspectiveCamera makeDefault position={[-0, 15, 15]} fov={55}>
	<OrbitControls enableZoom={false} enableDamping autoRotateSpeed={0.5} target.y={0} />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<Grid
	position.y={-0.001}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={25}
	cellSize={2}
/>

<ContactShadows scale={10} blur={2} far={2.5} opacity={0.5} />
<T.GridHelper args={[50]} />
