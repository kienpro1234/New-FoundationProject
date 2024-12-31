import React from "react";
import MenuLanding from "../components/Menu/MenuLanding";
import Footer from "../components/Footer/Footer";

export default function About() {
  return (
    <div className="about">
      <MenuLanding aboutTitle={"Tasty kitchen representing the quintessence of cuisine".toUpperCase()} />
      {/* about section */}
      <div className="container-big-screen px-4 py-5">
        {/* content flex */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="basis-1/2">
            <h2 className="text-2xl font-medium">
              TASTY KITCHEN
              <br />
              GET HIGH-END
              <br />
              CUISINE TO YOUR HOME
            </h2>
            <p className="my-3 text-sm text-zinc-500">
              Being a new F&B business model – online restaurant, TASTY Kitchen is a pioneer in delivering premium meal
              solutions to your family's dining table.
            </p>
            <p className="mb-4 text-sm text-zinc-500">
              With a kitchen system that is constantly being invested and expanded; natural, fresh ingredients carefully
              selected from the leading prestigious farms in Vietnam; and the creative, dedicated hands of experienced
              chefs, we are proud of serving our valued customers the best-quality and healthy dishes.
            </p>

            <button className="bg-red-500 px-4 py-2 text-white hover:bg-red-700">ORDER NOW!</button>
          </div>
          <div className="basis-1/2">
            <img className="object-cover" src="https://static.tastykitchen.vn/images/imgabout_1_v2.jpg" alt="" />
          </div>
        </div>
      </div>
      {/* Values section */}
      <div className="container-big-screen bg-about-values-img bg-cover bg-center px-4 py-5 text-white">
        {/* Top content */}
        <div className="mb-3 text-center">
          <h3 className="font-md text-sm">TASTY CHICKEN</h3>
          <h2 className="mb-3 text-4xl tracking-wider">CORE VALUES</h2>
          <p className="mx-auto w-full text-sm md:w-3/5">
            TASTY Kitchen pioneers the concept of "Restaurant at Home" in Vietnam with superior quality, bringing a
            unique new culinary style to diners.
          </p>
        </div>
        {/* Middle content */}
        <div className="mb-[45px] mt-[35px] flex flex-col gap-4 md:h-[150px] md:flex-row md:justify-between 2xl:justify-center 2xl:gap-[20px]">
          <div className="flex items-center justify-center rounded-3xl border border-white py-[15px] text-center text-white md:px-[45px] md:py-[76px]">
            {/* item content */}
            <div className="flex flex-col items-center gap-[16px]">
              <img
                className={"w-[50px]"}
                src="https://static.tastykitchen.vn/images/icon_conscientious_heart.png"
                alt=""
              />
              <p className="text-xl tracking-wide">TẬN TÂM</p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-white py-[15px] text-center text-white md:px-[45px] md:py-[76px]">
            {/* item content */}
            <div className="flex flex-col items-center gap-[16px]">
              <img className={"w-[50px]"} src="https://static.tastykitchen.vn/images/icon_acknowledge.png" alt="" />
              <p className="text-xl tracking-wide">TẬN TÂM</p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-white py-[15px] text-center text-white md:px-[45px] md:py-[76px]">
            {/* item content */}
            <div className="flex flex-col items-center gap-[16px]">
              <img className={"w-[50px]"} src="https://static.tastykitchen.vn/images/icon-loves.png" alt="" />
              <p className="text-xl tracking-wide">TẬN TÂM</p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-white py-[15px] text-center text-white md:px-[45px] md:py-[76px]">
            {/* item content */}
            <div className="flex flex-col items-center gap-[16px]">
              <img className={"w-[50px]"} src="https://static.tastykitchen.vn/images/icon-delicate.png" alt="" />
              <p className="text-xl tracking-wide">TẬN TÂM</p>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-white py-[15px] text-center text-white md:px-[45px] md:py-[76px]">
            {/* item content */}
            <div className="flex flex-col items-center gap-[16px]">
              <img className={"w-[50px]"} src="https://static.tastykitchen.vn/images/icon-loves.png" alt="" />
              <p className="text-xl tracking-wide">TẬN TÂM</p>
            </div>
          </div>
        </div>
        {/* Bottom content */}
        <div className="mx-auto mt-[10px] w-full md:w-[55%]">
          <p className="mb-3 text-center text-sm">
            TASTY Kitchen, with a huge passion for cuisine, wants to bring you more choices, at higher standards:
          </p>
          <div className="about-bottom-flex mx-auto flex w-4/5 flex-col flex-wrap justify-between gap-x-[50px] gap-y-7 text-sm md:w-full md:flex-row md:text-base">
            <div className="flex items-center justify-center gap-4">
              <img src="https://static.tastykitchen.vn/images/checked.svg" alt="" />
              <span>Tasty, nutritious and safe meals</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <img src="https://static.tastykitchen.vn/images/checked.svg" alt="" />
              <span>Tasty, nutritious and safe meals</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <img src="https://static.tastykitchen.vn/images/checked.svg" alt="" />
              <span>Tasty, nutritious and safe meals</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <img src="https://static.tastykitchen.vn/images/checked.svg" alt="" />
              <span>Tasty, nutritious and safe meals</span>
            </div>
          </div>
        </div>
      </div>
      {/* services section */}
      <div className="container-big-screen services py-5 md:px-4">
        {/* services top content */}
        <div className="mb-14 flex flex-col justify-center gap-12 overflow-auto md:flex-row md:gap-32">
          {/* item */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-[250px] w-[250px] rounded-full bg-zinc-200 md:h-[200px] md:w-[200px]">
              <img
                className="absolute left-[55%] top-1/2 translate-x-[-50%] translate-y-[-50%]"
                src="https://static.tastykitchen.vn/images/icon-oder.png"
                alt=""
              />
            </div>

            <p className="mt-2 text-center text-5xl font-semibold md:mt-0 md:text-4xl">PLACE ORDER</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-[250px] w-[250px] rounded-full bg-zinc-200 md:h-[200px] md:w-[200px]">
              <img
                className="absolute left-[50%] top-1/2 translate-x-[-50%] translate-y-[-50%]"
                src="https://static.tastykitchen.vn/images/icon-try-stretching.png"
                alt=""
              />
            </div>

            <p className="mt-2 text-5xl font-semibold md:mt-0 md:text-4xl">RELAX</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-[250px] w-[250px] rounded-full bg-zinc-200 md:h-[200px] md:w-[200px]">
              <img
                className="absolute left-[50%] top-1/2 translate-x-[-50%] translate-y-[-50%]"
                src="https://static.tastykitchen.vn/images/icon-enjoy.png"
                alt=""
              />
            </div>

            <p className="mt-2 text-5xl font-semibold md:mt-0 md:text-4xl">ENJOY</p>
          </div>
        </div>
        {/* services bottom content */}
        <div className="mx-auto mb-5 flex w-11/12 flex-col gap-x-4 gap-y-12 md:flex-row">
          {/* item */}
          <div className="flex flex-col gap-x-3 md:w-1/2 md:flex-row">
            <div className="w-full">
              <img
                className="w-full rounded-md shadow-md"
                src="https://static.tastykitchen.vn/images/img16.jpg"
                alt=""
              />
            </div>
            <p className="text-xl">
              Pure taste from natural and fresh ingredients rigorously selected from leading prestigious farms in
              Vietnam
            </p>
          </div>
          <div className="flex flex-col gap-x-3 md:w-1/2 md:flex-row">
            <div className="w-full">
              <img
                className="w-full rounded-md shadow-md"
                src="https://static.tastykitchen.vn/images/img16.jpg"
                alt=""
              />
            </div>
            <p className="text-xl">
              Pure taste from natural and fresh ingredients rigorously selected from leading prestigious farms in
              Vietnam
            </p>
          </div>
        </div>
        {/* content 2 */}
        <div className="mx-auto flex w-11/12 flex-col gap-x-4 gap-y-12 md:flex-row">
          {/* item */}
          <div className="flex flex-col gap-x-3 md:w-1/2 md:flex-row">
            <div className="w-full">
              <img
                className="w-full rounded-md shadow-md"
                src="https://static.tastykitchen.vn/images/img16.jpg"
                alt=""
              />
            </div>
            <p className="text-xl">
              Pure taste from natural and fresh ingredients rigorously selected from leading prestigious farms in
              Vietnam
            </p>
          </div>
          <div className="flex flex-col gap-x-3 md:w-1/2 md:flex-row">
            <div className="w-full">
              <img
                className="w-full rounded-md shadow-md"
                src="https://static.tastykitchen.vn/images/img16.jpg"
                alt=""
              />
            </div>
            <p className="text-xl">
              Pure taste from natural and fresh ingredients rigorously selected from leading prestigious farms in
              Vietnam
            </p>
          </div>
        </div>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}
