import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, View, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import InCallManager from 'react-native-incall-manager';
import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';
import KeepAwake from 'react-native-keep-awake';

const configuration = {
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
        {
            urls: ['turn:numb.viagenie.ca'],
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        // {
        //     urls: ['turn:numb.viagenie.ca'],
        //     credential: '@Abc12345',
        //     username: 'ltv.mrvu@gmail.com'
        // }
    ],
    // iceTransportPolicy: 'all',
    iceCandidatePoolSize: 10,
};

export default function JoinScreen({ route }) {

    const firstDelete = useRef(true)
    const localPC = useRef(null)

    const navigation = useNavigation()
    const [state, setState] = useState({
        roomId: '',
        startLocalComplete: false,
        startCallComplete: false,
    })

    const [localStream, setLocalStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const [isMuted, setIsMuted] = useState(false);
    const [isVideo, setIsVideo] = useState(false);

    useEffect(() => {
        InCallManager.start({ media: 'video' })
        localPC.current = new RTCPeerConnection();
        localPC.current.setConfiguration(configuration);
        KeepAwake.activate();

        return () => {
            InCallManager.stop({ busytone: '_BUNDLE_' })
            InCallManager.stopRingtone();
            InCallManager.setForceSpeakerphoneOn(false);
            InCallManager.setSpeakerphoneOn(false);
            KeepAwake.deactivate();

            if (localStream) {
                localStream.getTracks().forEach(t => t.stop());
                localStream.release();
                if (localPC.current && localPC.current.removeStream) {
                    localPC.current.removeStream(localStream);
                }
            }
            if (remoteStream) {
                remoteStream.getTracks().forEach(t => t.stop());
                remoteStream.release();
                if (localPC.current && localPC.current.removeStream) {
                    localPC.current.removeStream(remoteStream);
                }
            }
            if (localPC.current) {
                localPC.current.close();
                localPC.current = null
            }
        }
    }, [])

    useEffect(() => {
        const roomId = route.params.roomId
        setState(prev => { return { ...prev, roomId, } })
    }, [route]);

    useEffect(() => {
        if (!!state.roomId) {
            startLocalStream()
        }
    }, [state.roomId])

    useEffect(() => {

        if (!!state.roomId) {
            // const unsubscribe = firestore().collection('videorooms').onSnapshot((snapshot) => {
            //     if (snapshot) {
            //         snapshot.docChanges().forEach(change => {
            //             const id = change.doc.id
            //             if (change.type == 'removed' && id == state.roomId) {
            //                 onBackPress()
            //             }
            //         })
            //     }
            // })
            // return () => {
            //     unsubscribe();
            // }
            const roomRef = firestore().collection('videorooms').doc(state.roomId);
            if (roomRef) {
                const unsubscribeDeletedCallee = roomRef.collection('calleeCandidates').onSnapshot((snapshot) => {
                    if (snapshot) {
                        snapshot.docChanges().forEach(change => {
                            if (change.type == 'removed' && !!firstDelete.current) {
                                firstDelete.current = false
                                onBackPress()
                            }
                        })
                    }
                })
                const unsubscribeDeletedCaller = roomRef.collection('callerCandidates').onSnapshot((snapshot) => {
                    if (snapshot) {
                        snapshot.docChanges().forEach(change => {
                            if (change.type == 'removed' && !!firstDelete.current) {
                                firstDelete.current = false
                                onBackPress()
                            }
                        })
                    }
                })
                return () => {
                    unsubscribeDeletedCallee();
                    unsubscribeDeletedCaller();
                }
            }
        }

    }, [state.roomId])

    useEffect(() => {
        if (!!localStream && !!state.roomId) {
            joinCall(state.roomId)
        }
    }, [localStream, state.roomId])

    const onBackPress = async () => {

        if (localStream) {
            localStream.getTracks().forEach(t => t.stop());
            localStream.release();
            if (localPC.current && localPC.current.removeStream) {
                localPC.current.removeStream(localStream);
            }
        }

        if (remoteStream) {
            remoteStream.getTracks().forEach(t => t.stop());
            remoteStream.release();
            if (localPC.current && localPC.current.removeStream) {
                localPC.current.removeStream(remoteStream);
            }
        }
        if (localPC.current) {
            localPC.current.close();
            localPC.current = null
        }
        setLocalStream();
        setRemoteStream();
        InCallManager.stop({ busytone: '_BUNDLE_' });
        KeepAwake.deactivate();

        const parentRoute = navigation.getParent()
        if (!parentRoute) {
            navigation.navigate('Drawer')
        } else {
            navigation.popToTop()
        }

        const roomRef = await firestore().collection('videorooms').doc(state.roomId);
        if (roomRef) {
            const calleeCandidatesCollection = await roomRef.collection('calleeCandidates').get();
            if (calleeCandidatesCollection) {
                calleeCandidatesCollection.forEach(async (candidate) => {
                    await candidate.ref.delete()
                });
            }
            const callerCandidatesCollection = await roomRef.collection('callerCandidates').get();
            if (callerCandidatesCollection) {
                callerCandidatesCollection.forEach(async (candidate) => {
                    await candidate.ref.delete()
                });
            }
            roomRef.delete()
        }
    }

    const startLocalStream = async () => {
        // isFront will determine if the initial camera should face user or environment
        const isFront = true;
        const devices = await mediaDevices.enumerateDevices();

        const facing = isFront ? 'front' : 'environment';
        const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
        const facingMode = isFront ? 'user' : 'environment';
        const constraints = {
            audio: true,
            video: {
                // mandatory: {
                //     minWidth: 375, // Provide your own width, height and frame rate here
                //     minHeight: 812,
                //     minFrameRate: 30,
                // },
                facingMode,
                optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
            },
        };
        const newStream = await mediaDevices.getUserMedia(constraints);
        setLocalStream(newStream);
        setState(prev => { return { ...prev, startLocalComplete: true } })
    };

    const joinCall = async id => {

        // InCallManager.start({ media: 'video' })
        // InCallManager.setForceSpeakerphoneOn(true);
        // InCallManager.setSpeakerphoneOn(true);

        setState(prev => { return { ...prev, startCallComplete: true } })
        const roomRef = await firestore().collection('videorooms').doc(id);
        const roomSnapshot = await roomRef.get();

        if (!roomSnapshot.exists) return

        localPC.current.addStream(localStream);

        const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
        localPC.current.onicecandidate = e => {
            if (!e.candidate) {
                console.log('Got final candidate!');
                return;
            }
            calleeCandidatesCollection.add(e.candidate.toJSON());
        };

        localPC.current.onaddstream = e => {
            if (e.stream && remoteStream !== e.stream) {
                console.log('RemotePC received the stream join', e.stream);
                setRemoteStream(e.stream);
            }
        };

        const offer = roomSnapshot.data().offer;
        await localPC.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await localPC.current.createAnswer();
        await localPC.current.setLocalDescription(answer);

        const roomWithAnswer = { answer };
        await roomRef.update(roomWithAnswer);

        roomRef.collection('callerCandidates').onSnapshot(snapshot => {
            if (snapshot) {
                snapshot.docChanges().forEach(async change => {
                    if (change.type === 'added') {
                        let data = change.doc.data();
                        await localPC.current.addIceCandidate(new RTCIceCandidate(data));
                    }
                });
            }
        });
    };

    const switchCamera = () => {
        localStream.getVideoTracks().forEach(track => track._switchCamera());
    };

    // Mutes the local's outgoing audio
    const toggleMute = () => {
        if (!remoteStream) {
            return;
        }
        localStream.getAudioTracks().forEach(track => {
            // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
            track.enabled = !track.enabled;
            setIsMuted(!track.enabled);
        });
    };

    // Mutes the local's outgoing audio
    const toggleVideo = () => {
        if (!remoteStream) {
            return;
        }
        localStream.getVideoTracks().forEach(track => {
            console.log('getVideoTracks', track);
            track.enabled = !track.enabled;
            setIsVideo(!track.enabled);
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#eff1e4', }} >
            <View style={{ flex: 1, backgroundColor: 'pink' }} >
                <View style={[styles.rtcview, { backgroundColor: '#fff' }]}>
                    {remoteStream ?
                        <RTCView
                            mirror={true}
                            objectFit='cover'
                            style={styles.rtc}
                            streamURL={remoteStream && remoteStream.toURL()}
                        />
                        :
                        <ActivityIndicator size="large" color="#000" />
                    }
                </View>
                <View style={[styles.rtcview, { backgroundColor: '#00f' }]}>
                    {localStream ?
                        <RTCView
                            mirror={true}
                            objectFit='cover'
                            style={styles.rtc}
                            streamURL={localStream && localStream.toURL()}
                        />
                        :
                        <ActivityIndicator size="small" color="#000" />
                    }
                </View>
            </View>
            <View style={styles.callButtons} >
                {localStream && !state.startCallComplete &&
                    <View style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <FontAwesome5Icon
                            name={'phone'} size={20} color={'#00f'}
                            onPress={() => joinCall(state.roomId)} disabled={!!remoteStream}
                        />
                    </View>
                }
                {localStream &&
                    <TouchableOpacity style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: `${remoteStream ? '#fff' : '#0001'}`,
                        alignItems: 'center', justifyContent: 'center',
                    }}
                        onPress={toggleVideo} // disabled={!remoteStream}
                    >
                        <FontAwesome5Icon name={`${!isVideo ? 'video' : 'video-slash'}`}
                            size={20} color={'#000'}

                        />
                    </TouchableOpacity>
                }
                {localStream &&
                    <TouchableOpacity style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: `${remoteStream ? '#fff' : '#0001'}`,
                        alignItems: 'center', justifyContent: 'center',
                    }}
                        onPress={toggleMute} // disabled={!remoteStream}
                    >
                        <FontAwesome5Icon name={`${!isMuted ? 'microphone' : 'microphone-slash'}`}
                            size={20} color={'#000'}

                        />
                    </TouchableOpacity>
                }
                {localStream &&
                    <TouchableOpacity style={{
                        width: 48, height: 48, borderRadius: 24, backgroundColor: `${remoteStream ? '#fff' : '#0001'}`,
                        alignItems: 'center', justifyContent: 'center',
                    }}
                        onPress={switchCamera}
                    >
                        <MaterialIcon
                            name={'flip-camera-ios'} size={20} color={'#000'}
                        />
                    </TouchableOpacity>
                }
            </View>
            <TouchableOpacity
                style={{
                    position: 'absolute', top: 24, left: 24,
                    height: 48, width: 48, borderRadius: 24,
                    alignItems: 'center', justifyContent: 'center',
                    marginVertical: 8, backgroundColor: '#f00',
                }}
                onPress={onBackPress}
            >
                <FontAwesome5Icon
                    name={'phone-slash'} size={20} color={'#fff'}
                    disabled={true}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        alignSelf: 'center',
        fontSize: 30,
    },
    rtcview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eff1e4',
    },
    rtc: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'green'
    },
    toggleButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    callButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 48,
        padding: 8
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 24,
    }
});