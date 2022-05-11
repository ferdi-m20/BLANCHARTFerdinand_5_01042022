// Récupération de l'url et du paramètre
let params = new URL(document.location).searchParams;
// console.log(params);

// Récupération de l'id
let productId = params.get("id");

// Fonction qui permet de récupérer les données de l'API avec l'id du Produit concerné
async function getProduct() {
	try {
		const response = await fetch(
			"http://localhost:3000/api/products/" + productId
		);
		if (response.ok) {
			const data = await response.json();
			return displaySelectedProduct(data);
		} else {
			throw new Error("Échec du chargement de l'API");
		}
	} catch (error) {
		console.log(error.message);
	}
}

// Fonction qui permet d'insérer les données de l'API dans le DOM
function displaySelectedProduct(item) {
	// console.log(item);

	// Insertion de l'image
	let productImg = document.createElement("img");
	productImg.setAttribute("src", item.imageUrl);
	productImg.setAttribute("alt", item.altTxt);
	document.querySelector(".item__img").appendChild(productImg);
	// Insertion du titre "h1"
	let productTitle = document.getElementById("title");
	productTitle.textContent = item.name;
	// Insertion du prix
	let productPrice = document.getElementById("price");
	productPrice.textContent = item.price;
	// Insertion de la description
	let productDescription = document.getElementById("description");
	productDescription.textContent = item.description;
	// Insertion des options de couleurs
	for (let color of item.colors) {
		// console.log(color);
		let productColors = document.createElement("option");
		productColors.setAttribute("value", color);
		productColors.textContent = color;
		document.querySelector("#colors").appendChild(productColors);
	}
	// Déclencher l'évènement sur le bouton "ajouter au panier" grâce au fonction checkCart()
	const addButton = document.getElementById("addToCart");
	addButton.addEventListener("click", checkCart);
}

// Fonction checkCart permet de vérifer plusieurs conditions avant d'ajouter le produit au panier
function checkCart() {
	let productColor = document.querySelector("#colors").value;
	let productQuantity = Number(document.querySelector("#quantity").value);
	// Création d'un objet contenant l'id, la couleur et la quantité du produit
	let productDetails = {
		id: productId,
		color: productColor,
		quantity: productQuantity,
	};
	// Création de deux variables pour gérér l'erreur dans la condition
	let error = false;
	let msgError = "";

	// Si aucune couleur sélectionnée
	if (productColor == "") {
		msgError += "Veuillez sélectionner une couleur\r\n";
		error = true;
		// Si quantité est un nombre décimal
	} else if (!Number.isInteger(productQuantity)) {
		msgError +=
			"Veuillez renseigner un nombre entier compris entre 1 et 100\r\n";
		error = true;
		// Si quantité = 0
	} else if (productQuantity == 0) {
		msgError += "Veuillez renseigner une quantité\r\n";
		error = true;
		// Si quantité > 100
	} else if (productQuantity > 100) {
		msgError += "La quantité maximale autorisée est de 100\r\n";
		error = true;
		// Si quantité < 0
	} else if (productQuantity < 0) {
		msgError += "Veuillez ne pas saisir de valeur négative!\r\n";
		error = true;
	}
	// Si il y a une erreur, affiche le message d'erreur et annule l'action
	if (error) {
		alert(msgError);
		return;
	}
	// Appel de la fonction addToCart en passant l'objet productDetails commme argument
	addToCart(productDetails);
}

// Fonction qui permet d'ajouter un ou plusieurs produit au panier
function addToCart(productDetails) {
	// // Récupération des produits du LocalStorage
	// JSON String transformé en Objet Javascript
	let productsInLocalStorage = JSON.parse(localStorage.getItem("cartItems"));
	// Fenêtre pop-up de confirmation d'ajout du produit au panier et de redirection
	const popupConfirmation = function () {
		if (
			confirm(
				"Produit ajouté au panier !\nPour consulter votre panier, Cliquez sur OK !"
			)
		) {
			window.location.href = "cart.html";
		}
	};
	// Importation dans le local storage
	//  Si le panier contient déjà au moins 1 article de même id et même couleur
	if (productsInLocalStorage) {
		const resultFind = productsInLocalStorage.find(function (product) {
			return (
				product.id === productDetails.id &&
				product.color === productDetails.color
			);
		});
		// Si c'est le cas, incrémenter la quantité du produit en question
		if (resultFind) {
			let updateQuantity = productDetails.quantity + resultFind.quantity;
			resultFind.quantity = updateQuantity;
			// Si le panier contient des produits différents
		} else {
			productsInLocalStorage.push(productDetails);
		}
		// Si le panier est vide
	} else {
		productsInLocalStorage = [];
		productsInLocalStorage.push(productDetails);
	}
	// Objet Javascprit transformé en JSON String
	localStorage.setItem("cartItems", JSON.stringify(productsInLocalStorage));
	popupConfirmation();
}

getProduct();
