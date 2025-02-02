import React from 'react';

const BackgroundSVG: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 1600 983"
    fill="none"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: -1,
      pointerEvents: 'none',
    }}
  >
    <g filter="url(#filter0_f_2180_1187)">
      <path
        d="M5 983V152L301.5 490.087L594 152C639.333 372.828 803.5 484.821 842 528.004C919.677 615.129 947.667 516.067 1058.5 286.814C1110.5 480.959 1292.1 473.236 1298.5 490.087C1304.9 506.939 1448.83 360.189 1513 152L1599 511.152V983H5Z"
        fill="#2EB851"
        fillOpacity="0.7"
      />
      <path
        d="M5 983V152L301.5 490.087L594 152C639.333 372.828 803.5 484.821 842 528.004C919.677 615.129 947.667 516.067 1058.5 286.814C1110.5 480.959 1292.1 473.236 1298.5 490.087C1304.9 506.939 1448.83 360.189 1513 152L1599 511.152V983H5Z"
        stroke="#2EB851"
        strokeOpacity="0.7"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_2180_1187"
        x="-145.5"
        y="0.105835"
        width="1895"
        height="1133.39"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_2180_1187" />
      </filter>
    </defs>
  </svg>
);

export default BackgroundSVG;
