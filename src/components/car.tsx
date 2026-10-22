import { StyleSheet, View } from 'react-native';

type CarProps = { width: number; color: string };

export default function Car({ width, color }: CarProps) {
  const height = width * 1.7;
  const wheelW = width * 0.16;
  const wheelH = width * 0.34;
  const wheelOut = -wheelW * 0.4;

  return (
    <View style={{ width, height }}>
      {/* Llantas (detrás de la carrocería) */}
      <View style={[styles.wheel, { width: wheelW, height: wheelH, left: wheelOut, top: height * 0.15 }]} />
      <View style={[styles.wheel, { width: wheelW, height: wheelH, right: wheelOut, top: height * 0.15 }]} />
      <View style={[styles.wheel, { width: wheelW, height: wheelH, left: wheelOut, top: height * 0.6 }]} />
      <View style={[styles.wheel, { width: wheelW, height: wheelH, right: wheelOut, top: height * 0.6 }]} />

      {/* Carrocería */}
      <View style={[styles.body, { backgroundColor: color, borderRadius: width * 0.3 }]}>
        {/* Faros delanteros */}
        <View style={[styles.headlight, { left: width * 0.1, top: 3, width: width * 0.22, height: width * 0.1 }]} />
        <View style={[styles.headlight, { right: width * 0.1, top: 3, width: width * 0.22, height: width * 0.1 }]} />

        {/* Parabrisas */}
        <View style={[styles.glass, { top: height * 0.19, height: height * 0.17, left: width * 0.12, right: width * 0.12 }]} />
        {/* Techo */}
        <View style={[styles.roof, { top: height * 0.37, height: height * 0.25, left: width * 0.1, right: width * 0.1 }]} />
        {/* Vidrio trasero */}
        <View style={[styles.glass, { top: height * 0.64, height: height * 0.12, left: width * 0.14, right: width * 0.14 }]} />

        {/* Luces traseras */}
        <View style={[styles.taillight, { left: width * 0.1, bottom: 3, width: width * 0.22, height: width * 0.09 }]} />
        <View style={[styles.taillight, { right: width * 0.1, bottom: 3, width: width * 0.22, height: width * 0.09 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: { position: 'absolute', backgroundColor: '#111', borderRadius: 3 },
  body: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  headlight: { position: 'absolute', backgroundColor: '#FFF59D', borderRadius: 4 },
  taillight: { position: 'absolute', backgroundColor: '#FF5252', borderRadius: 3 },
  glass: { position: 'absolute', backgroundColor: 'rgba(20, 30, 45, 0.85)', borderRadius: 5 },
  roof: { position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 6 },
});