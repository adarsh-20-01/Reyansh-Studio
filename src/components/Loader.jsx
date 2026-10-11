import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <motion.div className="loader-wrap" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="loader-logo">REYANSH</div>
      <div className="loader-sub">STUDIO</div>
      <div className="loader-bar"><span /></div>
    </motion.div>
  )
}
