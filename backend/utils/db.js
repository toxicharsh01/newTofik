const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {

  const username = "tofikDB";
  const password = encodeURIComponent("877061@Tofik"); // @ becomes %40

  const uri = `mongodb+srv://${username}:${password}@tofik.gwhpmwu.mongodb.net/?appName=Tofik`;

  await mongoose.connect(uri);
}
