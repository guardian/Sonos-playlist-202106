
import { render, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { useSpring, animated, config } from "@react-spring/web";

const calc = (x, y, rect) => [
  -(y - rect.top - rect.height * .2) * .2,
  (x - rect.left - rect.width * .2) * .05,
  1.1
];
const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export default function OptionButton(props) {
  const ref = useRef(null);
  const [xys, set] = useState([0, 0, 1]);
  // const props = useSpring({ xys, config: config[preset] });
  const aminProps = useSpring({ xys, config: config.gentle });

  const handleClick = (e) => {
    e.preventDefault(); 
    props.selected(props.data);
  }

  return (
      <animated.a
        ref={ref}
        className="default-btn"
        style={{ transform: aminProps.xys.to(trans) }}
        onMouseLeave={() => set([0, 0, 1])}
        onMouseMove={(e) => {
          const rect = ref.current.getBoundingClientRect();
          set(calc(e.clientX, e.clientY, rect));
        }}
        onClick={handleClick}
      >{props.label}</animated.a>
  );
}