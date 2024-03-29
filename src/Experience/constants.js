import {
  Vector2,
  Vector3,
  Color,
  Euler,
  PlaneGeometry,
  Quaternion,
} from "three";

// Arcade Machine
export const ARCADE_SCREEN_WIDTH = 1006.986;
export const ARCADE_SCREEN_HEIGHT = 1210.1182617331252;
export const ARCADE_CSS_OBJECT_SCALE = new Vector3(0.00102, 0.00102, 0.00102);
export const ARCADE_CSS_OBJECT_POSITION = new Vector3(3.24776, 2.7421, 2.3009);
export const ARCADE_CSS_OBJECT_ROTATION_X = -Math.PI / 7;
export const ARCADE_CSS_OBJECT_ROTATION_Y = -Math.PI / 2;
export const CRT_UNIFORMS = {
  uCurvature: new Vector2(3, 3),
  uScreenResolution: new Vector2(
    ARCADE_SCREEN_WIDTH / 5,
    ARCADE_SCREEN_HEIGHT / 5
  ),
  uScanLineOpacity: new Vector2(0.5, 0.5),
  uBaseColor: new Color(0.1, 0.1, 0.1).convertSRGBToLinear(),
  uColor: new Color(0.0, 0.0, 0.0).convertSRGBToLinear(),
  uVignetteOpacity: 1,
  uBrightness: 2.5,
  uVignetteRoundness: 1,
};
export const ARCADE_IFRAME_SRC = "https://joan-arcade-machine.vercel.app";
export const ARCADE_IFRAME_PADDING = "16px";
export const ARCADE_MACHINE_CAMERA_POSITION = new Vector3(-1.7, 5.5, 2.3009);
export const ARCADE_MACHINE_CAMERA_QUATERNION = new Quaternion(
  -0.17756084520729903,
  -0.6844502511134536,
  -0.17756084520729903,
  0.6844502511134535
);
export const ARCADE_MACHINE_CAMERA_TARGET = new Vector3(
  3.25776,
  2.74209,
  2.3009
);

// Camera
export const CAMERA_POSITION = new Vector3(-23, 17, 23);
export const CAMERA_QUATERNION = new Quaternion(
  -0.19229498096591757,
  -0.3743024144764491,
  -0.07965118909235921,
  0.9036459654580388
);
export const CAMERA_TARGET = new Vector3(0, 2.5, 0);

//Carpet
export const CARPET_SHELLCOUNT = 32;
export const CARPET_UNIFORMS = {
  uColor: new Color(0.7529412, 0.5424671, 0.4392157).convertSRGBToLinear(),
  uShellCount: 32,
  uShellLength: 0.16,
  uDensity: 250,
  uThickness: 5,
};
export const CARPET_GROUP_SCALE = new Vector3(0.0355, 0.0355, 0.0355);
export const CARPET_GROUP_POSITION = new Vector3(-2.61408, 0.377, -0.904327);
export const CARPET_GROUP_ROTATION = new Euler(-Math.PI / 2, 0, 0);

//  Coffee
export const COFFEE_GEOMETRY = new PlaneGeometry(0.15, 0.6, 16, 64);
export const COFFEE_POSITION = new Vector3(0.230979, 2.3, -3.64951);

//Confetti
export const CONFETTI_AMOUNT = 500;
export const CONFETTI_EXPLOSION_RADIUS = 300;
export const CONFETTI_COLORS = [
  0xf03559, 0xf272b3, 0x9be4f2, 0xffeb5e, 0xffb300, 0x7bff8b,
];

// Monitors
export const MONITOR_SCREEN_WIDTH = 1370.178;
export const MONITOR_SCREEN_HEIGHT = 764.798;
export const MONITOR_IFRAME_PADDING = "8px";

// Left Monitor
export const LEFT_MONITOR_CSS_OBJECT_POSITION = new Vector3(
  1.06738,
  2.50725,
  -4.23009
);
export const LEFT_MONITOR_CSS_OBJECT_SCALE = new Vector3(0.00102, 0.00102, 1);
export const LEFT_MONITOR_IFRAME_SRC = "https://joan-os.vercel.app";
export const LEFT_MONITOR_CAMERA_POSITION = new Vector3(1.06738, 2.60725, -1.6);
export const LEFT_MONITOR_CAMERA_QUATERNION = new Quaternion(
  0,
  -0.06458455890406237,
  0,
  0.9979122380005006
);
export const LEFT_MONITOR_CAMERA_TARGET = new Vector3(
  1.06738,
  2.50725,
  -4.23009
);

// Right Monitor
export const RIGHT_MONITOR_CSS_OBJECT_POSITION = new Vector3(
  2.47898,
  2.50716,
  -4.14566
);

export const RIGHT_MONITOR_CSS_OBJECT_SCALE = new Vector3(0.00102, 0.00102, 1);
export const RIGHT_MONITOR_CSS_OBJECT_ROTATION_Y = (-7.406 * Math.PI) / 180;
export const RIGHT_MONITOR_IFRAME_SRC = "https://joan-art-gallery.vercel.app";
export const RIGHT_MONITOR_CAMERA_POSITION = new Vector3(
  2.13997,
  2.60716,
  -1.53751
);
export const RIGHT_MONITOR_CAMERA_QUATERNION = new Quaternion(
  -0.018960792071729096,
  -0.06457153090946945,
  -0.0012271102383421897,
  0.9977321784730022
);
export const RIGHT_MONITOR_CAMERA_TARGET = new Vector3(
  2.47898,
  2.50716,
  -4.14566
);

// Navigate
export const ELEMENTS_TO_RAYCAST = [
  "rubikGroup",
  "linkedin",
  "github",
  "itchio",
  "arcadeMachine",
  "arcadeMachineScreen",
  "leftMonitor",
  "leftMonitorScreen",
  "rightMonitor",
  "rightMonitorScreen",
  "whiteboard",
  "whiteboardCanvas",
];
export const ORBIT_CONTROLS_CONFIG = {
  enabled: false,
  screenSpacePanning: true,
  enableKeys: false,
  zoomSpeed: 1,
  enableDamping: true,
  dampingFactor: 0.05,
  rotateSpeed: 0.4,
  maxAzimuthAngle: Math.PI * 2,
  minAzimuthAngle: -Math.PI / 2,
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI / 2,
  minDistance: 2,
  maxDistance: 35,
  target: { y: 2.5 },
};

// Whiteboard
export const WHITEBOARD_CAMERA_POSITION = new Vector3(
  -3.3927,
  5.18774,
  4.61366
);
export const WHITEBOARD_CAMERA_QUATERNION = new Quaternion(
  -0.08802977047890838,
  0,
  0,
  0.9961178441878403,
  1
);
export const WHITEBOARD_CAMERA_TARGET = new Vector3(-3.3927, 3.18774, -4.61366);

// Rubik's cube
export const RUBIK_TARGET = new Vector3(0, 0, 0);
export const RUBIK_ROTATION_Y = (-152.484 * Math.PI) / 180;
export const RUBIK_POSITION = new Vector3(-0.67868, 1.499, -3.92849);
export const RUBIK_SCALE = 0.021432;

// Links
export const LINKEDIN_URL = "https://www.linkedin.com/in/joan-ramos-refusta/";
export const GITHUB_URL = "https://github.com/jrefusta";
export const ITCHIO_URL = "https://jrefusta.itch.io/";

// Top Chair
export const TOP_CHAIR_POSITION = new Vector3(1.4027, 0.496728, -1.21048);
