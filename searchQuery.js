const query = { $text: { $search: "amd" } };

const initializeDb = require('./server/db.js')

initializeDb()
.then(db => {
	db.collection("product")
	.find(query)
	.toArray()
	.then((result) => {
		console.log(result);
	})
}).catch(err => {
	console.error('Failed to make all database connections!')
	console.error(err)
	process.exit(1)
})