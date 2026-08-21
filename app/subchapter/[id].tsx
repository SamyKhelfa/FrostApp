import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";
import {
  useCompleteModuleMutation,
  useGetLessonByIdQuery,
  useGetMyProgressQuery,
  useGetSubchapterByIdQuery,
  useUncompleteModuleMutation,
} from "@/core/api";
import { toVimeoEmbedUrl } from "@/core/utils/vimeo";

export default function SubchapterDetail() {
  const { id, lessonId } = useLocalSearchParams<{
    id: string;
    lessonId?: string;
  }>();

  const router = useRouter();

  const {
    data: subchapter,
    isLoading,
    error,
  } = useGetSubchapterByIdQuery(Number(id));

  const { data: lesson } = useGetLessonByIdQuery(Number(lessonId), {
    skip: !lessonId,
  });

  const orderedModules = (lesson?.chapters ?? []).flatMap(
    (chapter) => chapter.subChapters ?? [],
  );

  const currentIndex = orderedModules.findIndex(
    (module) => module.id === Number(id),
  );

  const previousModule =
    currentIndex > 0 ? orderedModules[currentIndex - 1] : undefined;

  const nextModule =
    currentIndex >= 0 ? orderedModules[currentIndex + 1] : undefined;

  const goToModule = (moduleId: number) =>
    router.replace({
      pathname: "/subchapter/[id]",
      params: { id: moduleId, lessonId: lessonId ?? "" },
    });

  const [showCongrats, setShowCongrats] = useState(false);

  const { data: progress } = useGetMyProgressQuery();
  const [completeModule, { isLoading: isCompleting }] =
    useCompleteModuleMutation();
  const [uncompleteModule, { isLoading: isUncompleting }] =
    useUncompleteModuleMutation();

  const isCompleted = (progress ?? []).some(
    (entry) => entry.subChapterId === Number(id),
  );

  const isSaving = isCompleting || isUncompleting;

  const handleValidate = async () => {
    try {
      await completeModule(Number(id)).unwrap();

      const completedIds = new Set(
        (progress ?? []).map((entry) => entry.subChapterId),
      );
      completedIds.add(Number(id));

      const lessonFinished =
        orderedModules.length > 0 &&
        orderedModules.every((module) => completedIds.has(module.id));

      if (lessonFinished) {
        setShowCongrats(true);
        return;
      }

      if (nextModule) goToModule(nextModule.id);
    } catch {
      Alert.alert(
        "Impossible de valider",
        "Verifie ta connexion et reessaie.",
      );
    }
  };

  const handleUndo = async () => {
    try {
      await uncompleteModule(Number(id)).unwrap();
    } catch {
      Alert.alert("Impossible d'annuler", "Verifie ta connexion et reessaie.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </SafeAreaView>
    );
  }

  if (error || !subchapter) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ScreenHeader eyebrow="MODULE" title="Introuvable" />
          <Text style={styles.notice}>
            Ce module n&apos;existe pas ou n&apos;est plus disponible.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const embedUrl = toVimeoEmbedUrl(subchapter.video);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="MODULE" title={subchapter.title} />

        {embedUrl && (

          <View style={styles.playerFrame}>
            <WebView
              source={{ uri: embedUrl }}
              style={styles.player}
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              startInLoadingState
              renderLoading={() => (
                <View style={styles.playerLoading}>
                  <ActivityIndicator color={Colors.snow} />
                </View>
              )}
            />
          </View>
        )}

        {subchapter.duration > 0 && (
          <Text style={styles.duration}>{subchapter.duration} min</Text>
        )}

        {!!subchapter.description && (
          <Text style={styles.description}>{subchapter.description}</Text>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.validateButton,
            isCompleted && styles.validateButtonDone,
            pressed && styles.validateButtonPressed,
          ]}
          disabled={isSaving}
          onPress={isCompleted ? handleUndo : handleValidate}
        >
          {isSaving ? (
            <ActivityIndicator
              color={isCompleted ? Colors.navyAccent : Colors.snow}
            />
          ) : (
            <Text
              style={[
                styles.validateButtonText,
                isCompleted && styles.validateButtonTextDone,
              ]}
            >
              {isCompleted
                ? "✓ Module validé"
                : nextModule
                  ? "Valider et continuer"
                  : "Valider ce module"}
            </Text>
          )}
        </Pressable>

        {orderedModules.length > 0 && (
          <View style={styles.navBar}>
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                !previousModule && styles.navButtonDisabled,
                pressed && previousModule && styles.navButtonPressed,
              ]}
              disabled={!previousModule}
              onPress={() => previousModule && goToModule(previousModule.id)}
            >
              <Text
                style={[
                  styles.navButtonText,
                  !previousModule && styles.navButtonTextDisabled,
                ]}
                numberOfLines={1}
              >
                ‹ Précédent
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                styles.navButtonPrimary,
                !nextModule && styles.navButtonDisabled,
                pressed && nextModule && styles.navButtonPressed,
              ]}
              disabled={!nextModule}
              onPress={() => nextModule && goToModule(nextModule.id)}
            >
              <Text
                style={[
                  styles.navButtonText,
                  styles.navButtonTextPrimary,
                  !nextModule && styles.navButtonTextDisabled,
                ]}
                numberOfLines={1}
              >
                Suivant ›
              </Text>
            </Pressable>
          </View>
        )}

        {orderedModules.length > 0 && currentIndex >= 0 && (
          <Text style={styles.progressHint}>
            Module {currentIndex + 1} sur {orderedModules.length}
          </Text>
        )}
      </ScrollView>

      <Modal
        visible={showCongrats}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCongrats(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>❄️</Text>
            <Text style={styles.modalTitle}>Félicitations</Text>
            <Text style={styles.modalMessage}>
              Tu as terminé{lesson?.title ? ` « ${lesson.title} »` : " ce cours"}.
              {"\n"}Tous les modules sont validés.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalPrimary,
                pressed && styles.validateButtonPressed,
              ]}
              onPress={() => {
                setShowCongrats(false);
                router.replace("/(tabs)");
              }}
            >
              <Text style={styles.modalPrimaryText}>Revenir aux cours</Text>
            </Pressable>

            <Pressable
              style={styles.modalSecondary}
              onPress={() => setShowCongrats(false)}
              hitSlop={8}
            >
              <Text style={styles.modalSecondaryText}>Rester sur ce module</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.appBg,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },

  playerFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Colors.navyDeep,
    marginTop: -8,
  },
  player: {
    flex: 1,
    backgroundColor: Colors.navyDeep,
  },
  playerLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.navyDeep,
  },

  duration: {
    color: Colors.mutedSoft,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 16,
  },
  description: {
    color: Colors.mutedDark,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  validateButton: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.navyAccent,
    minHeight: 54,
  },
  validateButtonDone: {
    backgroundColor: Colors.iceLight,
    borderWidth: 1,
    borderColor: Colors.iceBorder,
  },
  validateButtonPressed: {
    opacity: 0.75,
  },
  validateButtonText: {
    color: Colors.snow,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  validateButtonTextDone: {
    color: Colors.navyAccent,
  },

  navBar: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonPrimary: {
    backgroundColor: Colors.navyAccent,
    borderColor: Colors.navyAccent,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  navButtonText: {
    color: Colors.navyAccent,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  navButtonTextPrimary: {
    color: Colors.snow,
  },
  navButtonTextDisabled: {
    color: Colors.mutedSoft,
  },
  progressHint: {
    color: Colors.mutedSoft,
    fontSize: 12,
    textAlign: "center",
    marginTop: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 32, 53, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: Colors.navyDeep,
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  modalEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  modalTitle: {
    color: Colors.navyAccent,
    fontSize: 24,
    fontWeight: "300",
    fontStyle: "italic",
    marginBottom: 10,
  },
  modalMessage: {
    color: Colors.mutedDark,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 24,
  },
  modalPrimary: {
    alignSelf: "stretch",
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: Colors.navyAccent,
    alignItems: "center",
  },
  modalPrimaryText: {
    color: Colors.snow,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  modalSecondary: {
    marginTop: 14,
  },
  modalSecondaryText: {
    color: Colors.mutedSoft,
    fontSize: 13,
  },

  notice: {
    color: Colors.mutedDark,
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
  },
});
