import { StyleSheet, View } from 'react-native';

type CarProps = { width: number; color: string; glass: string };

/** Carrito visto desde arriba (ícono del mapa). */
export default function Car({ width, color, glass }: CarProps) {
  const height = width * 1.7;
  const wheelW = width * 0.16;
  const wheelH = width * 0.32;
  const wheelOut = -wheelW * 0.4;
  const wheel = { width: wheelW, height: wheelH, backgroundColor: color, opacity: 0.85 };

  return (
    <View style={{ width, height }} accessible={false}>
      <View style={[styles.wheel, wheel, { left: wheelOut, top: height * 0.15 }]} />
      <View style={[styles.wheel, wheel, { right: wheelOut, top: height * 0.15 }]} />
      <View style={[styles.wheel, wheel, { left: wheelOut, top: height * 0.62 }]} />
      <View style={[styles.wheel, wheel, { right: wheelOut, top: height * 0.62 }]} />

      <View style={[styles.body, { backgroundColor: color, borderRadius: width * 0.32 }]}>
        {/* Parabrisas, techo y vidrio trasero */}
        <View style={[styles.part, { backgroundColor: glass, top: height * 0.2, height: height * 0.17, left: width * 0.13, right: width * 0.13 }]} />
        <View style={[styles.part, { backgroundColor: glass, opacity: 0.25, top: height * 0.4, height: height * 0.22, left: width * 0.12, right: width * 0.12 }]} />
        <View style={[styles.part, { backgroundColor: glass, top: height * 0.66, height: height * 0.11, left: width * 0.16, right: width * 0.16 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: { position: 'absolute', borderRadius: 3 },
  body: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  part: { position: 'absolute', borderRadius: 5 },
});
