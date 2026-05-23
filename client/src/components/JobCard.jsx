import { motion } from "framer-motion";

import {
  MapPin,
  IndianRupee,
  BriefcaseBusiness,
  Clock3,
  Bookmark,
  Building2,
} from "lucide-react";

export default function JobCard({ job, index }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
      whileHover={{
        scale: 1.03,
      }}
      className="
        bg-white/5
        border border-white/10
        backdrop-blur-3xl
        rounded-[35px]
        p-8
        shadow-2xl
        hover:border-yellow-300/30
        transition
      "
    >

      {/* TOP */}
      <div className="flex justify-between items-start mb-8">

        <div className="flex gap-5">

          {/* ICON */}
          <div className="
            bg-yellow-300
            text-black
            p-5
            rounded-3xl
            shadow-lg
            shadow-yellow-300/20
          ">

            <Building2 size={28} />

          </div>

          {/* INFO */}
          <div>

            <h3 className="text-2xl font-bold mb-2 text-white">

              {job.title}

            </h3>

            <p className="text-gray-300 text-lg">

              {job.company}

            </p>

          </div>

        </div>

        {/* SAVE */}
        <button className="
          bg-black/30
          border border-white/10
          p-3
          rounded-2xl
          hover:bg-yellow-300
          hover:text-black
          transition
        ">

          <Bookmark size={20} />

        </button>

      </div>

      {/* DETAILS */}
      <div className="flex flex-wrap gap-4 mb-8">

        <div className="
          flex items-center gap-2
          bg-black/30
          border border-white/10
          px-4 py-2
          rounded-2xl
        ">

          <MapPin
            size={16}
            className="text-blue-400"
          />

          <span className="text-sm text-white">

            {job.location}

          </span>

        </div>

        <div className="
          flex items-center gap-2
          bg-black/30
          border border-white/10
          px-4 py-2
          rounded-2xl
        ">

          <IndianRupee
            size={16}
            className="text-green-400"
          />

          <span className="text-sm text-white">

            {job.salary}

          </span>

        </div>

        <div className="
          flex items-center gap-2
          bg-black/30
          border border-white/10
          px-4 py-2
          rounded-2xl
        ">

          <BriefcaseBusiness
            size={16}
            className="text-yellow-300"
          />

          <span className="text-sm text-white">

            {job.type}

          </span>

        </div>

      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2 text-gray-400">

          <Clock3 size={16} />

          <span className="text-sm">

            {job.posted}

          </span>

        </div>

        <button className="
          bg-yellow-300
          hover:bg-yellow-400
          text-black
          px-6 py-3
          rounded-2xl
          font-bold
          transition
          shadow-lg
          shadow-yellow-300/20
        ">

          Apply Now

        </button>

      </div>

    </motion.div>
  );
}