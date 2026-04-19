import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="bg-white text-black">
      {/* 🔥 HERO */}
      <div className="h-[60vh] flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold">
            We Are <span className="text-orange-500">ORgone</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            More than fashion — it's expression, identity, and attitude.
          </p>
        </motion.div>
      </div>

      {/* 🧊 STORY SECTION */}
      <div className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          src="https://ik.imagekit.io/spy1710/orgone/loginImage.jpg?updatedAt=1776581471513"
          className="w-full h-125 object-cover"
          alt="our_story"
        />

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            ORgone was built for the new generation — bold thinkers, creators,
            and individuals who refuse to blend in. We believe fashion is not
            just clothing, it's a statement.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Every piece we design reflects minimalism with impact. Clean lines,
            strong identity, and timeless energy.
          </p>
        </motion.div>
      </div>

      {/* 🔥 VALUES */}
      <div className="bg-black text-white px-6 md:px-20 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl mb-12 text-center"
        >
          What We Stand For
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Minimal Design",
              desc: "Clean, simple, powerful aesthetics.",
            },
            {
              title: "Bold Identity",
              desc: "Wear confidence, not just clothes.",
            },
            {
              title: "Future Ready",
              desc: "Designed for tomorrow's generation.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-xl mb-3 text-orange-500">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🧊 IMAGE + TEXT SPLIT */}
      <div className="px-6 md:px-20 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl mb-6">Designed to Stand Out</h2>
          <p className="text-gray-600 leading-relaxed">
            Our collections are built with attention to detail, focusing on
            quality fabrics and modern silhouettes. We create pieces that feel
            effortless yet powerful.
          </p>
        </motion.div>

        <motion.img
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          src="https://ik.imagekit.io/spy1710/orgone/IN_ws23L_wk16_16x9.jpg_imwidth=1024"
          className="w-full h-125 object-cover"
          alt="CTA_Image"
        />
      </div>

      {/* 🔥 CTA */}
      <div className="bg-black text-white text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl mb-6"
        >
          Ready to Elevate Your Style?
        </motion.h2>

        <motion.a
          href="/shop"
          whileHover={{ scale: 1.05 }}
          className="bg-orange-500 px-6 py-3 text-black font-medium inline-block"
        >
          Explore Collection
        </motion.a>
      </div>
    </div>
  );
};

export default About;
