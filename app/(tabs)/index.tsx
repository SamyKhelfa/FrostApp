import { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

function FrostOrb({
  size,
  top,
  left,
  delay,
  opacity,
}: {
  size: number;
  top: number;
  left: number;
  delay: number;
  opacity: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 3000 + delay, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 3000 + delay, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      style={[
        styles.orb,
        animStyle,
        { width: size, height: size, borderRadius: size / 2, top, left, opacity },
      ]}
    />
  );
}

function SnowflakeIcon({ size = 64 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {[0, 30, 60, 90, 120, 150].map((angle) => (
        <View
          key={angle}
          style={[
            styles.snowflakeArm,
            {
              width: size * 0.85,
              height: 2.5,
              transform: [{ rotate: `${angle}deg` }],
              position: 'absolute',
            },
          ]}
        />
      ))}
      <View
        style={{
          width: size * 0.18,
          height: size * 0.18,
          borderRadius: size * 0.09,
          backgroundColor: '#A8D8F0',
        }}
      />
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const onPressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 100 });
  };

  const onPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 150 });
  };

  return (
    <View style={styles.container}>
      {/* Background orbs */}
      <FrostOrb size={320} top={-80} left={-100} delay={0} opacity={0.18} />
      <FrostOrb size={220} top={height * 0.3} left={width - 120} delay={600} opacity={0.12} />
      <FrostOrb size={180} top={height * 0.65} left={-60} delay={1200} opacity={0.1} />

      {/* Grid pattern overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <SnowflakeIcon size={68} />
        <Text style={styles.appName}>FROST</Text>
        <Text style={styles.tagline}>Clarity in every moment</Text>
      </Animated.View>

      {/* Divider */}
      <Animated.View entering={FadeIn.delay(400)} style={styles.divider} />

      {/* Features */}
      <View style={styles.featuresContainer}>
        <FeatureCard
          icon="✦"
          title="Crystal clear"
          description="A clean, minimal interface designed to keep you focused."
          delay={500}
        />
        <FeatureCard
          icon="◈"
          title="Sharp & fast"
          description="Fluid animations and snappy interactions, always."
          delay={650}
        />
        <FeatureCard
          icon="❋"
          title="Built for you"
          description="Adapts to your preferences, light or dark."
          delay={800}
        />
      </View>

      {/* CTA */}
      <Animated.View entering={FadeInUp.delay(950).springify()} style={styles.ctaContainer}>
        <Animated.View style={buttonStyle}>
          <Pressable
            style={styles.ctaButton}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => {}}>
            <Text style={styles.ctaButtonText}>Get started</Text>
          </Pressable>
        </Animated.View>
        <Text style={styles.ctaSubtext}>No account needed · Free forever</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080D18',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    backgroundColor: '#4FB3E8',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    borderWidth: 0,
  },
  snowflakeArm: {
    backgroundColor: '#A8D8F0',
    borderRadius: 2,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  appName: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: 14,
    color: '#E8F4FD',
  },
  tagline: {
    fontSize: 15,
    color: '#5B8FA8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#1A2D40',
    marginVertical: 36,
  },
  featuresContainer: {
    gap: 16,
    flex: 1,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 216, 240, 0.1)',
    padding: 18,
  },
  featureIcon: {
    fontSize: 24,
    color: '#4FB3E8',
    width: 36,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D6EEF8',
    letterSpacing: 0.3,
  },
  featureDescription: {
    fontSize: 13,
    color: '#4A6B7C',
    lineHeight: 18,
  },
  ctaContainer: {
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  ctaButton: {
    backgroundColor: '#4FB3E8',
    paddingVertical: 16,
    paddingHorizontal: 56,
    borderRadius: 50,
    shadowColor: '#4FB3E8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#080D18',
    letterSpacing: 0.5,
  },
  ctaSubtext: {
    fontSize: 12,
    color: '#2E4A5A',
    letterSpacing: 0.5,
  },
});
