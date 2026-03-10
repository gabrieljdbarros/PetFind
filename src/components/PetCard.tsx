import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Pet } from "../data/pets";

type Props = {
  pet: Pet;
};

export default function PetCard({ pet }: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: "/pet/[id]", params: { id: pet.id } })}
    >
      {pet.imagem ? (
        <Image source={{ uri: pet.imagem }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🐾</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{pet.nome}</Text>
        <Text style={styles.info}>{pet.especie} • {pet.raca}</Text>
        <Text style={styles.info}>{pet.idade} • {pet.porte}</Text>
        <Text style={styles.location}>{pet.local}</Text>
        <Text style={styles.description} numberOfLines={2}>{pet.descricao}</Text>

        <View style={styles.chipsRow}>
          {pet.personalidade.slice(0, 2).map((trait) => (
            <View key={trait} style={styles.chip}>
              <Text style={styles.chipText}>{trait}</Text>
            </View>
          ))}
          {pet.vacinado && (
            <View style={styles.chipGreen}>
              <Text style={styles.chipTextGreen}>Vacinado</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: 190,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 42,
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "#E8F0FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2F80ED",
  },
  chipGreen: {
    backgroundColor: "#E8F7EE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipTextGreen: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E9E52",
  },
});
