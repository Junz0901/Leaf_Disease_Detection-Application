import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';

const ScanPlantScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);

    if (!permission) {
        // Camera permissions are still loading.
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.message}>Requesting Camera Permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                setCapturedImage(photo.uri);
                // Navigate to results or preview
                navigation.navigate('AnalysisResults', { imageUri: photo.uri });
            } catch (error) {
                console.error("Failed to take picture:", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                ref={cameraRef}
                onCameraReady={() => console.log("Camera Ready")}
                onMountError={(e) => console.error("Camera Mount Error", e)}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <View style={styles.captureBtn} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    captureBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        borderWidth: 5,
        borderColor: '#ccc',
    },
});

export default ScanPlantScreen;
