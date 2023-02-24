// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];

// `mongodb+srv://mmrocha905:WFEDZM7pBrdTMCj@fullstackopen3.psvldp5.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);



// const Entry = mongoose.model("Entry", entrySchema);

// if (process.argv.length === 3) {
//   Entry.find({}).then((result) => {
//     result.forEach((entry) => {
//       console.log(entry);
//     });
//     mongoose.connection.close();
//   });
// } else if (process.argv.length === 5) {
//   const entry = new Entry({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   entry.save().then((result) => {
//     console.log(
//       "Name:",
//       result.name,
//       " Number:",
//       result.number,
//       "added to phonebook"
//     );
//     mongoose.connection.close();
//   });
// } else {
//   console.log("Invalid number of arguments");
//   process.exit(1);
// }
