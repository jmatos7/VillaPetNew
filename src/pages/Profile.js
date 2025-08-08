// Profile.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    InputGroup,
    Image,
} from "react-bootstrap";
import { useDebounce } from "use-debounce";
import "./Profile.scss";

export default function Profile() {
    const fileInputRef = useRef(null);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        phone2: "",
    });

    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState({
        name: "",
        breed: "",
        age: "",
        species: "",
        photo: "",
    });

    const [editPhone, setEditPhone] = useState(false);

    const toggleEditPhone = () => {
        const wasEditing = editPhone; // guarda o valor atual antes de mudar
        setEditPhone((prev) => !prev);

        if (wasEditing) {
            // Só salva quando estás a sair do modo edição
            try {
                fetch("http://localhost:3001/api/user/me/update-phone", {
                    credentials: "include",
                    method: "PUT", // Deveria ser PUT porque o backend usa router.put
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phone: user.phone,
                        phone2: user.phone2,
                    }),
                });
            } catch (error) {
                console.error("Erro ao atualizar telefone:", error);
            }
        }
    };


    useEffect(() => {
        async function fetchUserData() {
            try {
                const res = await fetch(`http://localhost:3001/api/user/me`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Erro ao carregar perfil");
                const data = await res.json();
                setAnimals(data.animals || []);
                console.log(data.animals);
                setUser(data);
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
            }
        }
        fetchUserData();
    }, []);

    const [photoPreview, setPhotoPreview] = useState(null);
    const [dogBreeds, setDogBreeds] = useState([]);
    const [catBreeds, setCatBreeds] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const [debouncedBreed] = useDebounce(newAnimal.breed, 300);

    useEffect(() => {
        async function fetchBreeds() {
            try {
                const [resDog, resCat] = await Promise.all([
                    fetch("https://api.thedogapi.com/v1/breeds"),
                    fetch("https://api.thecatapi.com/v1/breeds"),
                ]);
                const [dogData, catData] = await Promise.all([
                    resDog.json(),
                    resCat.json(),
                ]);
                setDogBreeds(dogData);
                setCatBreeds(catData);
            } catch (error) {
                console.error("Erro a carregar raças:", error);
            }
        }
        fetchBreeds();
    }, []);

    const breedList = useMemo(() => {
        return newAnimal.species === "Cão" ? dogBreeds : catBreeds;
    }, [newAnimal.species, dogBreeds, catBreeds]);

    const breedSuggestions = useMemo(() => {
        const query = debouncedBreed.trim().toLowerCase();
        if (query.length < 3) return [];

        const domain = newAnimal.species === "Cão" ? "thedogapi" : "thecatapi";
        return breedList
            .filter((breed) => breed.name.toLowerCase().includes(query))
            .slice(0, 7)
            .map((breed) => {
                let imgUrl = "https://via.placeholder.com/50";
                if (breed.image?.url) {
                    imgUrl = breed.image.url;
                } else if (breed.reference_image_id) {
                    imgUrl = `https://cdn2.${domain}.com/images/${breed.reference_image_id}.jpg?width=60`;
                }
                return { id: breed.id, name: breed.name, imgUrl };
            });
    }, [debouncedBreed, breedList, newAnimal.species]);

    useEffect(() => {
        setSuggestions(breedSuggestions);
        setShowSuggestions(breedSuggestions.length > 0);
    }, [breedSuggestions]);


    const handleSuggestionClick = (name) => {
        setNewAnimal((prev) => ({ ...prev, breed: name }));
        setShowSuggestions(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handlePhoneChange = (e, campo = "telefone") => {
        const valor = e.target.value;
        if (/^\d{0,9}$/.test(valor)) {
            setUser((prev) => ({ ...prev, [campo]: valor }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setPhotoPreview(null);
            setNewAnimal((a) => ({ ...a, photoFile: null }));
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
            setNewAnimal((a) => ({ ...a, photoFile: file }));
        };
        reader.readAsDataURL(file);
    };


    const addAnimal = async (e) => {
        e.preventDefault();

        if (!newAnimal.name.trim()) return alert("O nome é obrigatório!");
        if (newAnimal.age && Number(newAnimal.age) < 0)
            return alert("A idade não pode ser negativa!");

        const formData = new FormData();
        formData.append("name", newAnimal.name);
        formData.append("breed", newAnimal.breed);
        formData.append("age", newAnimal.age ? Number(newAnimal.age) : "");
        formData.append("species", newAnimal.species);
        if (newAnimal.photoFile) {
            formData.append("image", newAnimal.photoFile); // nome do campo que o backend espera
        }

        try {
            const response = await fetch("http://localhost:3001/api/animal/me/createanimal", {
                method: "POST",
                credentials: "include", 
                body: formData, 
            });

            if (!response.ok) throw new Error("Erro ao adicionar animal");
            const data = await response.json();

            setAnimals((prev) => [...prev, data.animal]);
            setNewAnimal({
                name: "",
                breed: "",
                age: "",
                type: "Cão",
                photoFile: null,
            });
            setPhotoPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Erro ao adicionar animal:", error);
            alert("Erro ao adicionar animal. Tente novamente.");
        }
    };


    const removeAnimal = (id) => {
        if (!window.confirm("Tens a certeza que queres remover este animal?")) return;

        fetch(`http://localhost:3001/api/animal/me/deleteanimal/${id}`, {
            credentials: "include",
            method: "DELETE",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao remover animal");
                setAnimals((prev) => prev.filter((a) => a.id !== id));
            })
            .catch((error) => {
                console.error("Erro ao remover animal:", error);
                alert("Erro ao remover animal. Tente novamente.");
            });
        setNewAnimal({
            name: "",
            breed: "",
            age: "",
            species: "",
            photo: "",
        });
        setPhotoPreview(null);
    };

    return (
        <Container className="profile-page my-5">
            <h1 className="text-center mb-4">Perfil do Usuário</h1>

            <Card className="mb-4">
                <Card.Body>
                    <div className="campo-info">
                        <p className="texto"><strong>Nome:</strong> {user.name}</p>
                    </div>

                    <div className="campo-info">
                        <p className="texto"><strong>Email:</strong> {user.email}</p>
                    </div>

                    <div className="campo-info">
                        <label htmlFor="telefone"><strong>Número de Telemóvel:</strong></label>
                        {!editPhone ? (
                            <p className="texto">{user.phone || "Não definido"}</p>
                        ) : (
                            <InputGroup>
                                <input
                                    id="telefone"
                                    type="tel"
                                    className="phone-input"
                                    placeholder="912345678"
                                    value={user.phone || ""}
                                    onChange={(e) => handlePhoneChange(e, "phone")}
                                    maxLength={9}
                                />
                            </InputGroup>
                        )}
                    </div>

                    <div className="campo-info">
                        <label htmlFor="segundoContacto"><strong>Segundo Contacto (opcional):</strong></label>
                        {!editPhone ? (
                            <p className="texto">{user.phone2 || "Não definido"}</p>
                        ) : (
                            <InputGroup>
                                <input
                                    id="telefone"
                                    type="tel"
                                    className="phone-input"
                                    placeholder="912345678"
                                    value={user.phone2 || ""}
                                    onChange={(e) => handlePhoneChange(e, "phone2")}
                                    maxLength={9}
                                />
                            </InputGroup>
                        )}

                        <Button variant="secundary" onClick={toggleEditPhone} className="mt-3">
                            {editPhone ? "Guardar" : "Editar Número"}
                        </Button>
                    </div>

                    <div className="campo-info">
                        <Button>
                            Logout
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Row>
                <Col>
                    <h2 className="mb-4">Meus Animais</h2>
                    {animals.length === 0 ? (
                        <p className="text-muted">Ainda não adicionaste nenhum animal.</p>
                    ) : (
                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                            {animals.map(({ id, name, breed, age, species, imageUrl }) => (
                                <Col key={id}>
                                    <Card className="animal-card shadow-sm h-100">
                                        <div className="image-wrapper">
                                            <Card.Img
                                                variant="top"
                                                src={imageUrl || null}
                                                alt={name}
                                                loading="lazy"
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{name}</Card.Title>
                                            <Card.Text className="mb-2">
                                                <b>Tipo:</b> {species}<br />
                                                <b>Raça:</b> {breed || "Não especificada"}<br />
                                                <b>Idade:</b> {age || "Não especificada"} anos
                                            </Card.Text>
                                            <Button
                                                variant="outline-danger"
                                                className="mt-auto"
                                                onClick={() => removeAnimal(id)}
                                            >
                                                Remover
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                className="mt-5px "
                                            >
                                                Editar
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>

            <Row className="mt-5 justify-content-center">
                <Col xs={12} md={6}>
                    <h3 className="mb-3">Adicionar novo animal</h3>
                    <Form onSubmit={addAnimal} autoComplete="off">
                        <Form.Group className="mb-3" controlId="animalName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome do animal"
                                value={newAnimal.name}
                                onChange={(e) =>
                                    setNewAnimal({ ...newAnimal, name: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="animalType">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select
                                value={newAnimal.species}
                                onChange={(e) =>
                                    setNewAnimal({
                                        ...newAnimal,
                                        species: e.target.value,
                                        breed: "",
                                    })
                                }
                            >
                                <option value="">-- Selecione o tipo -- </option>
                                <option>Cão</option>
                                <option>Gato</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative" controlId="animalBreed" ref={suggestionsRef}>
                            <Form.Label>Raça</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Raça"
                                value={newAnimal.breed}
                                onChange={(e) =>
                                    setNewAnimal({ ...newAnimal, breed: e.target.value })
                                }
                                onFocus={() => {
                                    if (suggestions.length) setShowSuggestions(true);
                                }}
                            />
                            {showSuggestions && (
                                <div className="breed-suggestions">
                                    {suggestions.map(({ id, name, imgUrl }) => (
                                        <div
                                            key={id}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(name)}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={name}
                                                className="breed-image"
                                                loading="lazy"
                                            />
                                            <span>{name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="animalAge">
                            <Form.Label>Idade (anos)</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                placeholder="Idade"
                                value={newAnimal.age}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        setNewAnimal({ ...newAnimal, age: val });
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="animalPhoto">
                            <Form.Label>Foto</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                            />
                            {photoPreview && (
                                <div className="preview-wrapper mt-3">
                                    <Image
                                        src={photoPreview}
                                        rounded
                                        thumbnail
                                        alt="Preview da foto do animal"
                                        loading="lazy"
                                        style={{ maxHeight: "180px" }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Adicionar Animal
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
