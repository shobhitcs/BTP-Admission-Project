import React from "react";

function Footer(props) {
  return (
    <div className="w-full flex justify-center items-center h-[70px] bg-[#1B3058] mt-auto">
      <p className="text-md text-yellow-400 font-semibold">
        Built by
        <b className="text-slate-400"> Noel Vincent P,Rohit R Patil</b> Under
        the Supervision of
        <b className="text-slate-400">
          {" "}
          Dr.Divya Padmanabhan,Dr.Satyanath Bhat
        </b>
      </p>
    </div>
  );
}

export default Footer;
