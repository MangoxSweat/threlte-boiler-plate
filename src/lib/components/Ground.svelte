<script>
	import { T } from '@threlte/core';
	import { AutoColliders } from '@threlte/rapier';
</script>

<T.Group position={[0, -0.5, 0]}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh receiveShadow>
			<T.BoxGeometry args={[10, 1, 10]} />
			<T.MeshStandardMaterial />
		</T.Mesh>
	</AutoColliders>
	<!-- Add bounding box for player movement and projectile visibility -->
	<AutoColliders shape={'cuboid'}>
		<T.Mesh visible={false}>
			<T.BoxGeometry args={[12, 2, 12]} />
			<T.MeshStandardMaterial />
		</T.Mesh>
	</AutoColliders>
</T.Group>
