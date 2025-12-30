import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const scale = width / 428;

export default function Scan() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // --- 1. SỬA STATE: Dùng boolean cho Torch ---
  const [torchOn, setTorchOn] = useState(false);

  const scanAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!capturedImage) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.setValue(1);
    }
  }, [capturedImage]);

  if (!permission) return <View style={{ backgroundColor: "#000", flex: 1 }} />;
  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ textAlign: "center", marginBottom: 20, color: "#FFF" }}>
          Cần quyền truy cập Camera để chụp hóa đơn
        </Text>
        <TouchableOpacity style={styles.btnGrant} onPress={requestPermission}>
          <Text style={styles.btnGrantText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const simulateOCR = async (uri) => {
    setIsProcessing(true);
    // Tắt đèn khi bắt đầu xử lý ảnh
    setTorchOn(false);

    setTimeout(() => {
      setIsProcessing(false);
      setCapturedImage(null);

      const mockData = {
        amount: "145000",
        date: new Date().toISOString(),
        note: "Highlands Coffee - Quét hóa đơn",
        categoryName: "Ăn uống",
      };

      navigation.navigate("MainTabs", {
        screen: "Home",
        params: { scannedBill: mockData },
      });
    }, 2000);
  };

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        setCapturedImage(photo.uri);
        simulateOCR(photo.uri);
      } catch (error) {
        console.log(error);
        Alert.alert("Lỗi", "Không chụp được ảnh");
      }
    }
  };

  // --- 2. SỬA HÀM TOGGLE ---
  const toggleFlash = () => {
    setTorchOn(!torchOn);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* CAMERA */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image
            source={{ uri: capturedImage }}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            // --- 3. DÙNG PROP enableTorch ---
            enableTorch={torchOn}
            ref={cameraRef}
          />
        )}
      </View>

      {/* FLASH BUTTON */}
      <TouchableOpacity
        style={[styles.iconButton, { top: 50, left: 30 }]}
        onPress={toggleFlash}
      >
        <MaterialCommunityIcons
          // Đổi icon cho hợp lý
          name={torchOn ? "flashlight" : "flashlight-off"}
          size={24}
          color={torchOn ? "#FFEB3B" : "#FFFFFF"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconButton, { top: 50, right: 30 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      {/* INSTRUCTION */}
      <View style={[styles.instructionWrapper, { top: 100 }]}>
        <BlurView intensity={30} tint="dark" style={styles.instructionBlur}>
          <Text style={styles.instructionText}>
            Đưa về phía hóa đơn của bạn!
          </Text>
        </BlurView>
      </View>

      {/* CROSSHAIR */}
      <Animated.View
        style={[
          styles.crosshairContainer,
          { transform: [{ scale: scanAnim }] },
        ]}
      >
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {isProcessing && (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        )}
      </Animated.View>

      {/* SHUTTER BUTTON */}
      <View style={styles.shutterContainer}>
        <TouchableOpacity onPress={takePicture} disabled={isProcessing}>
          <View style={styles.shutterOuter}>
            <View style={styles.shutterInner} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  cameraContainer: { ...StyleSheet.absoluteFillObject },

  btnGrant: {
    backgroundColor: "#1F41BB",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  btnGrantText: { color: "#FFF", fontFamily: "Montserrat-Bold" },

  iconButton: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  instructionWrapper: {
    position: "absolute",
    alignSelf: "center",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(224, 224, 224, 0.1)",
  },
  instructionBlur: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },

  crosshairContainer: {
    position: "absolute",
    width: 270 * scale,
    height: 270 * scale,
    top: (height - 270 * scale) / 2 - 30,
    left: (width - 270 * scale) / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  corner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderColor: "#FFFFFF",
    borderWidth: 6,
    borderRadius: 20,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  loadingCenter: { alignItems: "center" },
  loadingText: {
    color: "#FFF",
    marginTop: 10,
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
  },

  shutterContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#CCC",
  },
});
