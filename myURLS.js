let contact_file = require('./data');

const first = (req, res) => {
	res.send("ABOUT");
};

const contact = (req, res) => {
	if (!contact_file)
		res.status(404).json({message : "No contact found."});
	else
		res.json(contact_file);
};

const contactid = (req, res) => {
	const requestId = req.params.id;

	let contact = contact_file.filter(contact => {
		return contact.id == requestId;
	});

	if (!contact[0])
		res.status(404).json({ message: "Contact introuvable" });

	res.json(contact[0]);
};

export { first, contact, contactid };
