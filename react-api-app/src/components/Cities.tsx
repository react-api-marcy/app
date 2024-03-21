function Cities() {
  const cities = ['New York', 'Miami', 'London', 'Los Angeles']
  return (
    <div className="w-[20%]  bg-white bg-opacity-15 rounded-[25px] ">
      {" "}
      <div className="w-[90%] m-5">
      <p className=" text-[1.1rem] pb-5 ">Popular Cities</p>
      <ul className="flex font-light flex-col gap-3">
        {
          cities.map(city => {
            return <li>{city}</li>
          })
        }
      </ul>
      </div>
      
    </div>
  );
}

export default Cities;
