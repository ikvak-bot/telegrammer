import axios from 'axios';

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {
  IonApp,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRippleEffect,
  IonRow,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import {camera} from 'ionicons/icons'
import FormData from 'form-data';

import './variables.css'
import './App.css'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function App() {
  const [text, setText] = useState("")
  const [photo, setPhoto] = useState()

  const BOT_TOKEN="7486689121:AAFZEPN-5p39zYbeeTnfdrGqUlw79blRa-M";
  const CHAT_ID="-4284638396"

  function base64ToBlob(base64String, sliceSize = 512) {
    // Подготавливает картинку для отправки 
    const match = base64String.match(
      /data:([a-zA-Z\d]+\/[a-zA-Z\d\-.+]+);base64,(.*)/,
    );
  
    if (!match || match.length < 3) {
      throw new Error("Invalid base64 string");
    }
  
    const contentType = match[1];
    const byteCharacters = atob(match[2]);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  function sendMessage() {
    const message = `<b>Message to you:)</b>\n${text}`;
    
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('parse_mode', 'HTML');

    try {
      const encodedPhoto = base64ToBlob(photo || '');
      formData.append('photo', encodedPhoto, 'photo-from-phone.png');
      formData.append('caption', message);
      axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, formData);
    }
    catch {
      formData.append('text', message);
      axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        formData
      );
    }
  }

  function dpns(e) {
    setText(e.target.value)
  }

  async function takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    setPhoto(image.dataUrl);
  }

  return (
    <IonApp>
      <IonPage>
      <h1>Telegrammer</h1>
      <canvas>
        
      </canvas>
      <div className="card">
        <div>
        <button onClick={sendMessage}>
          Send message
        </button>
        <input onChange={dpns}/>
        </div>
        <div>
          <button className="photo-card" onClick={takePhoto}>
            Photo
          </button>
        </div>
      </div>
    </IonPage>
    </IonApp>
  )
}

export default App
