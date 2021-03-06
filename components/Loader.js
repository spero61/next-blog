import { motion } from 'framer-motion';

const loaderVariants = {
  bouncingBall: {
    x: [-40, 40],
    y: [0, -60],
    transition: {
      x: {
        duration: 1.8,
        repeat: Infinity,
        repeatType: 'reverse',
      },
      y: {
        duration: 0.35,
        repeat: Infinity,
        repeatType: 'reverse',
        ease:"easeOut",
      },
    },
  },
};

const MotionLoader = () => {
  return (
    <>
      <motion.div
        className="bouncingBall"
        variants={loaderVariants}
        animate="bouncingBall"
      ></motion.div>
    </>
  );
};

export default function Loader({ isLoading }) {
  return isLoading ? <MotionLoader></MotionLoader> : null;
}
