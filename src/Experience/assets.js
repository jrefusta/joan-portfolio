export default [
  {
    name: "base",
    data: {},
    items: [
      {
        name: "topChairModel",
        source: "/assets/models/topChair.glb",
        type: "model",
      },
      { name: "rubiksCube", source: "/assets/models/Rubik.glb" },
      {
        name: "skyTexture",
        source: "/assets/textures/skyTexture.ktx2",
        type: "texture",
      },
      {
        name: "perlin",
        source: "/assets/textures/perlin.png",
        type: "texture",
      },
      {
        name: "baked1",
        source: "/assets/textures/baked1.ktx2",
        type: "texture",
      },
      {
        name: "baked2",
        source: "/assets/textures/baked2.ktx2",
        type: "texture",
      },
      {
        name: "baked3",
        source: "/assets/textures/baked3.ktx2",
        type: "texture",
      },
      {
        name: "texture_paint",
        source: "/assets/textures/texture_paint.png",
        type: "texture",
      },
      { name: "_roomModel", source: "/assets/models/room.glb" },
      { name: "_roomModel2", source: "/assets/models/room2.glb" },
      { name: "_roomModel3", source: "/assets/models/room3.glb" },
      { name: "whiteboard", source: "/assets/models/whiteboard.glb" },
      { name: "leftMonitor", source: "/assets/models/leftMonitor.glb" },
      { name: "rightMonitor", source: "/assets/models/rightMonitor.glb" },
      { name: "arcadeMachine", source: "/assets/models/arcadeMachine.glb" },
      { name: "linkedin", source: "/assets/models/linkedin.glb" },
      { name: "github", source: "/assets/models/github.glb" },
      { name: "itchio", source: "/assets/models/itchio.glb" },
      {
        name: "cubeTexture",
        source: [
          "/assets/environmentMaps/nx.jpg",
          "/assets/environmentMaps/ny.jpg",
          "/assets/environmentMaps/nz.jpg",
          "/assets/environmentMaps/px.jpg",
          "/assets/environmentMaps/py.jpg",
          "/assets/environmentMaps/pz.jpg",
        ],
        type: "cubeTexture",
      },
    ],
  },
];
