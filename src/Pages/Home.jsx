import React from "react";

import FeaturedHabits from "../Components/FeaturedHabits";
import Slider from "../Components/Slider";
import WhyBuildHabits from "../Components/WhyBuildHabits";
import HomeExtras from "../Components/HomeExtras";

const Home = () => {
  return (
    <div>
      <section>
        <Slider />
      </section>
      <section>
        <FeaturedHabits />
      </section>
      <section>
        <WhyBuildHabits />
      </section>
      <section>
        <HomeExtras />
      </section>
    </div>
  );
};

export default Home;
