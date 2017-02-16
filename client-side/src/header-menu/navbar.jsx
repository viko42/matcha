import React, { Component } from 'react'
import { Link } from 'react-router'
import SearchBar from './search/SearchBar'
import './navbar.css'

const matches = {
  'macbook a': [
    'macbook air 13 case',
    'macbook air 11 case',
    'macbook air charger'
  ],
  'macbook p': [
    'macbook pro 13 case',
    'macbook pro 15 case',
    'macbook pro charger'
  ],
  '': [
	'Aubrette Petit',
	'Albracca Primeau',
	'Warrane Goudreau',
	'Jewel Clavet',
	'Philip Leclerc',
	'Élise Angélil',
	'Linette Angélil',
	'Dixie Morin',
	'Didiane Charbonneau',
	'Channing Fluet',
	'Zacharie Jacques',
	'Porter Bonneville',
	'Flordelis Lacombe',
	'Joanna Hervé',
	'Florence Bonnet',
	'Odette Ruest',
	'Normand Lejeune',
	'Perrin Plante',
	'Royce Meunier',
	'Bernard Petrie',
	'Lirienne Goguen',
	'Alacoque Pelland',
	'Diane Provencher',
	'Fanette Garreau',
	'Pinabel Souplet',
	'Amélie Chouinard',
	'Victor Lancien',
	'Tristan Brunelle',
	'Franck Leduc',
	'Victor Cliche',
	'Capucine Langlais',
	'Fifi Thibodeau',
	'Serge Bois',
	'Beaufort Primeau',
	'Caresse Aucoin',
	'Marjolaine Brisebois',
	'Parnella Saucier',
	'Eugenia Doyon',
	'Archaimbau Marceau',
	'Azura Boisvert',
	'Telford Généreux',
	'Merci Thibault',
	'Léon Mothé',
	'Clarimunda Gregoire',
	'Gill Cartier',
	'Nicolette Phaneuf',
	'Amorette Gour',
	'Tristan Fremont',
	'Marveille Paradis',
	'Madelene Grandpré',
	'Oliver Arnoux',
	'Patience Arnoux',
	'Fantina Gamache',
	'Felicienne Lacroix',
	'Rachelle Labrie',
	'Avice Rouze',
	'Suzette Masson',
	'Satordi Blanc',
	'Dominique Bordeaux',
	'Beaufort LaGarde',
	'Agathe Labrosse',
	'Sibyla Gladu',
	'Camille St-Jacques',
	'Saber Sciverit',
	'Lundy Batard',
	'Diane Lemaître',
	'Nicholas CinqMars',
	'Coralie Veilleux',
	'Victoire Lizotte',
	'Pauline Lécuyer',
	'Ernest Therriault',
	'Madeleine Théberge',
	'Ruby Joly',
	'Ray Lagrange',
	'Tabor Parmentier',
	'Dorene Quiron',
	'Alexandrin Mousseau',
	'Georges Bisson',
	'Peverell Chalifour',
	'Vaden Lafontaine',
	'Crescent Chabot',
	'Solaine Laliberté',
	'Joséphine Brault',
	'Paul Lefèbvre',
	'Xavierre Mousseau',
	'Nadine Sanschagrin',
	'Garland Cadieux',
	'Michel Doyon',
	'Warrane Bellefeuille',
	'Gaetane Trottier',
	'Voleta LaGrande',
	'Byron Allain',
	'Yolette Quirion',
	'Matilda Ménard',
	'Fayette Lussier',
	'Jules Plante',
	'Avelaine Rivard',
	'Véronique Bisaillon',
	'Claudette Chicoine',
	'Andrée Aubé'
]
};

class NavBar extends Component {
	onChange(input, resolve) {
	  // Simulate AJAX request
	  setTimeout(() => {
		const suggestions = matches[Object.keys(matches).find((partial) => {
		  return input.match(new RegExp(partial), 'i');
		})] || ['macbook', 'macbook air', 'macbook pro'];

		resolve(suggestions.filter((suggestion) =>
		  suggestion.match(new RegExp('^' + input.replace(/\W\s/g, ''), 'i'))
		));
	  }, 25);
  	}
	onSearch(input) {
		if (!input)
			return;
		console.info(`Searching "${input}"`);
	}
	render() {
		return (
		<div id="App-header-bar">
			<div id="search-bar">
				<SearchBar
				placeholder="Recherche 'Prenom nom'"
				onChange={this.onChange}
				onSearch={this.onSearch}
			/>
			</div>
			<div id="menu-bar" className="menu-bar">
				<Link to="/" alt=""><div className="App-header-elem"><h4 className="App-header-elem-txt">Accueil</h4></div></Link>
				<Link to="/profile" alt=""><div className="App-header-elem"><h4 className="App-header-elem-txt">Mon compte</h4></div></Link>
				<div className="App-header-elem"><h4 className="App-header-elem-txt">Contact</h4></div>
			</div>
		</div>
		)
	}
}

export default NavBar;
