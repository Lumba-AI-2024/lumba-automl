import React, { useEffect, useState } from "react";
import Button from "../../Button/Button";
import Illustration from "./Illustration";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  {
    title: "Goodbye to messy and inaccurate data",
    desc: "You can easily clean your data, saving you valuable time. Enjoy the benefits of having clean data with just a few clicks.",
  },
  {
    title: "Start predicting the future with confidence",
    desc: "Our machine learning techniques help you analyze and predict data with good accuracy. Stay one step ahead and make informed decisions based on reliable insights.",
  },
  {
    title: "Get a glimpse into the future of your business",
    desc: "Our data forecasting feature help you analyze and forecast data. Provides the right insights you need to achieve your business goals",
  },
];

function Content() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setStep((step) => {
          if (step === 2) {
            return 0;
          }

          return step + 1;
        }),
      2000
    );
    return () => clearInterval(interval);
  }, [setStep]);

  return (
    <>
      <div className="relative">
        <p className="font-bold text-xl mt-6 text-center opacity-0" aria-hidden>
          {items[1].title}
        </p>
        <p className="mt-3 text-center text-sm opacity-0" aria-hidden>
          {items[1].desc}
        </p>
        <AnimatePresence initial={false}>
          <motion.div
            key={step}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "tween" }}
            className="absolute left-0 -top-4"
          >
            <p className="font-bold text-xl mt-6 text-center">{items[step].title}</p>
            <p className="mt-3 text-center text-sm">{items[step].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid place-items-center mt-8">
        <div className="flex gap-2.5">
          {items.map((_, i) => {
            if (i === step) {
              return <div key={i} className="w-[7px] h-[7px] rounded-full bg-lightblue/80"></div>;
            }
            return <div key={i} className="w-[7px] h-[7px] rounded-full bg-gray/50"></div>;
          })}
        </div>
      </div>
    </>
  );
}

export default function MainCarousel({ onFinish }) {
  const [show, setShow] = useState(true);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed z-50 grid place-items-center inset-0 w-full h-full">
      {/* Overlay */}
      <div className="fixed inset-0 h-full w-full bg-black/40 -z-10"></div>

      <div className="bg-white rounded-lg px-6 py-8 max-w-lg overflow-hidden">
        <div className="grid place-items-center">
          <Illustration />
        </div>

        <Content />

        <div className="grid place-items-center mt-10">
          <Button
            onClick={() => {
              setShow(false);
              onFinish();
            }}
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
