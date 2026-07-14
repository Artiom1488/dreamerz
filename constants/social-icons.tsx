import { Sparkles } from "lucide-react";

type IconProps = { className?: string; style?: React.CSSProperties };

export function StarRow({ count }: { count: number }) {
  return (
    <div className="mb-3 flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Sparkles
          key={i}
          className="h-4 w-4 text-amber-400"
          fill="currentColor"
        />
      ))}
    </div>
  );
}

const GoogleIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LogoIconBlack = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="88"
    height="32"
    viewBox="0 0 88 32"
    fill="none"
    className={className}
  >
    <path
      d="M71.243 5.015c.27.068.44.343.372.618l-.864 3.46 2.11-1.264a.393.393 0 0 1 .536.135.39.39 0 0 1-.136.535l-2.11 1.265 3.462.864a.51.51 0 0 1 .372.617.51.51 0 0 1-.618.372l-3.462-.864 1.265 2.109a.39.39 0 0 1-.135.535.393.393 0 0 1-.536-.135l-1.265-2.109-.864 3.46a.51.51 0 0 1-.618.372.51.51 0 0 1-.372-.618l.864-3.46-2.105 1.265a.393.393 0 0 1-.536-.135.39.39 0 0 1 .136-.536l2.11-1.264-3.462-.864a.51.51 0 0 1-.372-.618.51.51 0 0 1 .618-.371l3.462.863-1.265-2.109a.39.39 0 0 1 .135-.535.393.393 0 0 1 .536.135l1.265 2.109.864-3.46a.505.505 0 0 1 .613-.372"
      fill="currentColor"
    />
    <path d="M62 7.674C45.643 3.452 29.648 4.231 14 10" stroke="currentColor" />
    <path
      d="M1 20h1.64q1.587 0 2.356.378.768.377 1.27 1.229c.333.569.497 1.228.497 1.989a3.9 3.9 0 0 1-.277 1.485 3.1 3.1 0 0 1-.77 1.128q-.494.446-1.063.62Q4.08 27 2.669 27H1zm1.377 1.29v4.416h.644c.635 0 1.091-.07 1.378-.212.287-.14.517-.378.7-.705.179-.327.273-.735.273-1.219 0-.74-.216-1.319-.649-1.727-.39-.367-1.01-.554-1.87-.554zM13.317 20h1.471q1.206.001 1.72.206t.823.69c.207.323.31.7.31 1.139 0 .458-.112.846-.343 1.153q-.344.467-1.034.7L17.98 27h-1.514l-1.636-2.961h-.14V27h-1.373zm1.377 2.74h.437q.669 0 .922-.167c.169-.11.249-.297.249-.559a.64.64 0 0 0-.127-.398.64.64 0 0 0-.334-.241c-.136-.05-.395-.076-.766-.076h-.386v1.44zM24.256 20h3.972v1.304h-2.595v1.26h2.595v1.284h-2.595v1.843h2.595v1.304h-3.972zm12.622 0h1.396l2.797 7h-1.438l-.569-1.44h-2.98L35.5 27h-1.439zm.7 1.863-.987 2.407h1.965zM47.991 20h1.345l1.692 4.88L52.73 20h1.34l1.217 7h-1.335l-.776-4.422L51.634 27h-1.222l-1.532-4.422L48.09 27h-1.35zm13.567 0h3.973v1.304h-2.595v1.26h2.595v1.284h-2.595v1.843h2.595v1.304h-3.973zm10.493 0h1.471q1.207.001 1.72.206.515.205.823.69c.207.323.31.7.31 1.139 0 .458-.112.846-.342 1.153q-.344.467-1.035.7L76.714 27h-1.513l-1.636-2.961h-.141V27h-1.378v-7zm1.377 2.74h.437q.67 0 .922-.167c.17-.11.249-.297.249-.559a.64.64 0 0 0-.127-.398.64.64 0 0 0-.334-.241c-.136-.05-.395-.076-.766-.076h-.385v1.44zM82.595 20H87l-2.595 5.71h2.426v1.285h-4.447l2.58-5.68h-2.369z"
      fill="currentColor"
    />
  </svg>
);

const LogoIconWhite = ({ className }: IconProps) => (
  <svg
    width={160}
    height={50}
    viewBox="0 0 500 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M397.066 36.27a2.76 2.76 0 0 1 1.995 3.334l-4.638 18.675 11.323-6.824c.984-.599 2.28-.26 2.876.73s.259 2.291-.726 2.89L396.574 61.9l18.577 4.663a2.76 2.76 0 0 1 1.995 3.334 2.743 2.743 0 0 1-3.316 2.005l-18.578-4.662 6.789 11.382c.596.99.259 2.292-.726 2.89-.984.6-2.28.261-2.876-.728L391.651 69.4l-4.638 18.675a2.745 2.745 0 0 1-3.317 2.005 2.76 2.76 0 0 1-1.995-3.334l4.638-18.675-11.297 6.824c-.984.6-2.28.26-2.876-.729-.596-.99-.259-2.292.726-2.891l11.323-6.824-18.578-4.662a2.76 2.76 0 0 1-1.995-3.334 2.744 2.744 0 0 1 3.316-2.006l18.578 4.662-6.789-11.382c-.595-.99-.259-2.291.726-2.89s2.28-.261 2.876.729l6.788 11.382 4.638-18.675a2.71 2.71 0 0 1 3.291-2.006"
      fill="#fff"
    />
    <path
      d="M349.624 52.21C259.457 30.175 171.285 34.238 85.03 64.347"
      stroke="#fff"
      strokeWidth={3.672}
      strokeMiterlimit={22.926}
      strokeLinecap="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 120.581h9.043q8.744 0 12.98 1.953c2.825 1.303 5.157 3.412 6.996 6.355s2.747 6.356 2.747 10.289c0 2.786-.518 5.339-1.529 7.683s-2.435 4.272-4.25 5.834c-1.813 1.537-3.756 2.605-5.855 3.204-2.098.599-5.752.885-10.934.885H13zm7.592 6.668v22.842h3.55c3.497 0 6.01-.365 7.591-1.094 1.58-.73 2.85-1.954 3.86-3.647.985-1.693 1.503-3.802 1.503-6.303 0-3.828-1.191-6.824-3.575-8.933-2.15-1.902-5.57-2.865-10.312-2.865zm60.293-6.668h8.11c4.43 0 7.591.364 9.483 1.068 1.891.703 3.394 1.901 4.534 3.568s1.71 3.62 1.71 5.886c0 2.37-.622 4.376-1.892 5.965-1.269 1.615-3.16 2.813-5.7 3.62l9.457 16.096h-8.343l-9.016-15.314h-.778v15.314h-7.565zm7.591 14.169h2.41c2.461 0 4.145-.287 5.078-.86s1.374-1.536 1.374-2.891c0-.781-.234-1.484-.7-2.057a3.55 3.55 0 0 0-1.84-1.251c-.751-.26-2.176-.39-4.223-.39H88.45v7.449zm52.701-14.169h21.894v6.746h-14.302v6.511h14.302v6.642h-14.302v9.533h14.302v6.745h-21.894zm69.569 0h7.695l15.417 36.203h-7.929l-3.135-7.449h-16.427l-3.213 7.449h-7.928zm3.861 9.637-5.441 12.45h10.83zm57.391-9.637h7.41l9.328 25.238 9.379-25.238h7.385l6.71 36.203h-7.358l-4.275-22.868-8.499 22.868h-6.737l-8.446-22.868-4.353 22.868h-7.436zm74.776 0h21.894v6.746h-14.302v6.511h14.302v6.642h-14.302v9.533h14.302v6.745h-21.894zm57.832 0h8.11c4.43 0 7.591.364 9.483 1.068 1.891.703 3.394 1.901 4.534 3.568s1.71 3.62 1.71 5.886c0 2.37-.622 4.376-1.891 5.965-1.27 1.615-3.161 2.813-5.701 3.62l9.458 16.096h-8.343l-9.017-15.314h-.777v15.314h-7.592v-36.203zm7.591 14.169h2.41c2.462 0 4.146-.287 5.078-.86s1.374-1.536 1.374-2.891c0-.781-.233-1.484-.7-2.057a3.55 3.55 0 0 0-1.839-1.251c-.752-.26-2.177-.39-4.224-.39h-2.124v7.449zm50.525-14.169H487l-14.302 29.536h13.369v6.641h-24.511l14.225-29.379h-13.059z"
      fill="#fff"
    />
  </svg>
);

const HelpArrow = (props: IconProps) => (
  <svg
    width={743}
    height={843}
    viewBox="0 0 743 843"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="landing-page-svg"
    {...props}
  >
    <path
      d="m642.171 98.812 44.451-32.907c1.758-1.3 4.348-.929 5.741 1.006 1.342 1.893.945 4.488-.826 5.814l-.005.004-44.44 32.898-7.418 5.491 9.045 1.554 37.677 6.473.007.002.008.001c1.185.198 2.077 1.426 1.894 2.704-.161 1.123-1.256 2.012-2.524 1.804l-.007-.001-37.661-6.471-9.199-1.58 5.514 7.746 32.837 46.131v.001h.001c1.345 1.893.95 4.491-.823 5.819-1.759 1.295-4.344.92-5.735-1.014l-.004-.004-32.828-46.12-5.468-7.682-1.375 9.383-5.64 38.471-.002.012c-.161 1.125-1.26 2.016-2.531 1.804-1.183-.198-2.075-1.422-1.895-2.698l.001-.006 5.685-38.513 1.365-9.245-7.372 5.457-44.451 32.907-.001.001c-1.759 1.3-4.348.927-5.741-1.007-1.341-1.893-.944-4.488.827-5.814l.005-.004 44.44-32.898 7.417-5.491-9.044-1.554-37.677-6.473-.008-.002-.008-.001c-1.185-.198-2.077-1.426-1.894-2.704.161-1.123 1.257-2.013 2.526-1.804l.006.001 37.661 6.471 9.198 1.58-5.514-7.746-32.837-46.132-.004-.006-.004-.006c-1.386-1.931-.948-4.468.775-5.743 1.759-1.301 4.35-.929 5.743 1.007l.003.006 32.829 46.12 5.46 7.67 1.383-9.368 5.687-38.529.001-.008.002-.008c.161-1.125 1.26-2.016 2.531-1.803l.595-3.867-.595 3.866c1.183.198 2.074 1.422 1.895 2.698l-.001.006-5.685 38.513-1.365 9.245z"
      fill="url(#a)"
      stroke="url(#b)"
      strokeWidth={7.73}
    />
    <path
      d="M532.447 182.683C318.011 343.534 165.037 549.774 73.265 801.477"
      stroke="url(#c)"
      strokeWidth={10.956}
      strokeMiterlimit={22.926}
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="a"
        x1={714.492}
        y1={169.646}
        x2={550.676}
        y2={238.367}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#f8ed84" />
        <stop offset={0.495} stopColor="#f5e0ff" />
        <stop offset={1} stopColor="#84fad5" />
      </linearGradient>
      <linearGradient
        id="b"
        x1={714.492}
        y1={169.646}
        x2={550.676}
        y2={238.367}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#f8ed84" />
        <stop offset={0.495} stopColor="#f5e0ff" />
        <stop offset={1} stopColor="#84fad5" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={357.462}
        y1={469.997}
        x2={191.671}
        y2={380.801}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#f8ed84" />
        <stop offset={0.495} stopColor="#f5e0ff" />
        <stop offset={1} stopColor="#84fad5" />
      </linearGradient>
    </defs>
  </svg>
);

function IconArrowLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSparkle({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconInfo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={1.4} />
      <path
        d="M12 11V16.2"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function IconShopper({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M49.4989 22.2932H16.1687C14.8446 22.2932 13.7147 23.2504 13.497 24.5564L8.98284 51.6415C8.70768 53.2925 9.98079 54.7953 11.6545 54.7953H54.0131C55.6868 54.7953 56.9599 53.2925 56.6847 51.6415L52.1706 24.5564C51.9529 23.2504 50.8229 22.2932 49.4989 22.2932Z"
        stroke="url(#shopper_a)"
        strokeWidth={4.02407}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22.2928C22 16.3093 26.8506 11.4587 32.834 11.4587C38.8175 11.4587 43.6681 16.3093 43.6681 22.2928"
        stroke="url(#shopper_b)"
        strokeWidth={4.02407}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="shopper_a"
          x1="19.18"
          y1="8.36"
          x2="54.98"
          y2="32.83"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="shopper_b"
          x1="26.64"
          y1="6.82"
          x2="39.42"
          y2="18.70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconPlanet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M33.1603 54.7949C45.1272 54.7949 54.8283 45.0938 54.8283 33.1268C54.8283 21.1599 45.1272 11.4587 33.1603 11.4587C21.1933 11.4587 11.4922 21.1599 11.4922 33.1268C11.4922 45.0938 21.1933 54.7949 33.1603 54.7949Z"
        stroke="url(#planet_a)"
        strokeWidth={4.02407}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46.7033 15.792C52.1471 14.8985 56.2204 15.6058 57.6797 18.1334C60.6714 23.3153 51.5448 34.1855 37.2947 42.4128C23.0446 50.64 9.0674 53.1089 6.07567 47.927C4.36845 44.97 6.6074 40.1607 11.4927 35.0472"
        stroke="url(#planet_b)"
        strokeWidth={4.02407}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="planet_a"
          x1="20.77"
          y1="-7.11"
          x2="59.95"
          y2="11.10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="planet_b"
          x1="16.80"
          y1="0.33"
          x2="55.86"
          y2="27.52"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M33.1578 54.7949C33.1578 54.7949 8.78125 41.2184 8.78125 24.9264C8.78125 8.63437 27.7408 7.27671 33.1578 20.0236C38.5749 7.27671 57.5344 8.63437 57.5344 24.9264C57.5344 41.2184 33.1578 54.7949 33.1578 54.7949Z"
        stroke="url(#heart_a)"
        strokeWidth={4.02407}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="heart_a"
          x1="19.22"
          y1="-7.11"
          x2="61.31"
          y2="14.90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconLeaf({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M19.1345 46.8429C7.65439 27.7095 22.9612 12.4027 51.6614 14.3161C53.5746 43.0161 38.2679 58.323 19.1345 46.8429Z"
        stroke="url(#leaf_a)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1836 51.7914L29.4904 36.4846"
        stroke="url(#leaf_b)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="leaf_a"
          x1="23.12"
          y1="-1.50"
          x2="56.14"
          y2="13.85"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="leaf_b"
          x1="17.46"
          y1="29.92"
          x2="31.30"
          y2="36.36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconRainbow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 66 66" fill="none" className={className}>
      <path
        d="M57.4715 46.625V41.2133C57.4715 27.7635 46.5683 16.8604 33.1185 16.8604C19.6688 16.8604 8.76562 27.7635 8.76562 41.2133V46.625"
        stroke="url(#rainbow_a)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49.3573 46.6251V41.2133C49.3573 32.2468 42.0885 24.978 33.122 24.978C24.1555 24.978 16.8867 32.2468 16.8867 41.2133V46.6251"
        stroke="url(#rainbow_b)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.2392 46.6249V41.2131C41.2392 36.7299 37.6048 33.0955 33.1215 33.0955C28.6383 33.0955 25.0039 36.7299 25.0039 41.2131V46.6249"
        stroke="url(#rainbow_c)"
        strokeWidth={4.02016}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="rainbow_a"
          x1="19.20"
          y1="4.10"
          x2="53.12"
          y2="29.91"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="rainbow_b"
          x1="23.84"
          y1="15.70"
          x2="47.86"
          y2="32.45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
        <linearGradient
          id="rainbow_c"
          x1="28.48"
          y1="27.30"
          x2="42.09"
          y2="34.89"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#84FAD5" />
          <stop offset="0.577071" stopColor="#EBBFFF" />
          <stop offset="1" stopColor="#F6EC85" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export {
  GoogleIcon,
  LogoIconBlack,
  LogoIconWhite,
  HelpArrow,
  IconArrowLeft,
  IconSparkle,
  IconInfo,
  IconShopper,
  IconPlanet,
  IconHeart,
  IconLeaf,
  IconRainbow,
};
