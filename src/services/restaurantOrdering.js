export const fetchDishes = async () => {
  const response = await fetch(
    "https://833e-2405-4802-4b3-73d0-6c49-4138-b6c6-67b9.ngrok-free.app/api/v1/dishes?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo"
  );

  console.log(response)
  const data = await response.json();

  console.log("data", data)

  return data;
};
