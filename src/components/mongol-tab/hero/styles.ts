export const HERO_CSS = `
  @keyframes ms-left  { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
  @keyframes ms-right { from{transform:translateX(-50%)} to{transform:translateX(0)}    }

  .ms-track { display:flex; gap:8px; width:max-content; will-change:transform; }
  .ms-left  { animation: ms-left  var(--spd) linear infinite; }
  .ms-right { animation: ms-right var(--spd) linear infinite; }

  .ms-card {
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  .ms-card img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.6s ease;
    pointer-events: none;
    user-select: none;
  }

  @keyframes hint-bounce {
    0%,100% { transform:translateX(-50%) translateY(0);   }
    55%      { transform:translateX(-50%) translateY(10px); }
  }
  .hint-anim { animation: hint-bounce 2.4s ease-in-out infinite; }
`;

