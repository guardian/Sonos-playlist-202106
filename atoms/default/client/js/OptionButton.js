
import { render, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
// import { useSpring, animated, config } from "@react-spring/web";
import gsap from "gsap/gsap-core";

const calc = (x, y, rect) => [
  -(y - rect.top - rect.height * .2) * .1,
  (x - rect.left - rect.width * .2) * .02,
  1.1
];
const trans = (xys) => {
    
// return {scale: s, rotateY: y}
return {rotateX: xys[0], rotateY: xys[1], scale: xys[2], duration: 0.2, ease: 'sine.out', rotateZ: 0.01}
}
//   `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export default function OptionButton(props) {
  const ref = useRef(null);
//   const [xys, set] = useState([0, 0, 1]);
  // const props = useSpring({ xys, config: config[preset] });
//   const aminProps = useSpring({ xys, config: config.gentle });

  const handleClick = (e) => {
    e.preventDefault(); 
    props.selected(props.data);
  }

  return (
      <a
        ref={ref}
        className="default-btn option-btn"
        // style={{ transform: aminProps.xys.to(trans) }}
        // onMouseLeave={() => set([0, 0, 1])}
        onMouseLeave={() => gsap.to(ref.current, trans([0, 0, 1]))}
        onMouseMove={(e) => {
          const rect = ref.current.getBoundingClientRect();
        //   set(calc(e.clientX, e.clientY, rect));
        // console.log(e.clientX, e.clientY, rect);
        gsap.killTweensOf(ref.current);
          gsap.to(ref.current, trans(calc(e.clientX, e.clientY, rect)));
        }}
        onClick={handleClick}
      >{props.label}</a>
  );
}