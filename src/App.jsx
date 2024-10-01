import { useState } from "react";
import Settings from "./components/Settings";
import Keys from "./components/Keys";
import "./styles.css";
export default function App() {
  const [currentInstrument, setCurrentInstrument] = useState("piano");
  const [playbackRate, setPlaybackRate] = useState(10);
  const [volume, setVolume] = useState(50);
  const [loop, setLoop] = useState(false);
  const [loopingNotes, setLoopingNotes] = useState([]);
  const [showKeys, setShowKeys] = useState({
    musicKeys: false,
    computerKeys: false,
    noKeys: true,
  });

  const [synthKeys, setSynthKeys] = useState([
    {
      keyName: "c2",
      displayName: "c2",
      computerKey: "a",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "c-sharp",
      displayName: "c#",
      computerKey: "w",
      color: "black",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "d",
      displayName: "d",
      computerKey: "s",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "d-sharp",
      displayName: "d#",
      computerKey: "e",
      color: "black",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "e",
      displayName: "e",
      computerKey: "d",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "f",
      displayName: "f",
      computerKey: "f",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "f-sharp",
      displayName: "f#",
      computerKey: "t",
      color: "black",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "g",
      displayName: "g",
      computerKey: "g",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "g-sharp",
      displayName: "g#",
      computerKey: "y",
      color: "black",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "a",
      displayName: "a",
      computerKey: "h",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "a-sharp",
      displayName: "a#",
      computerKey: "u",
      color: "black",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "b",
      displayName: "b",
      computerKey: "j",
      color: "white",
      active: false,
      keyPressed: false,
    },

    {
      keyName: "c3",
      displayName: "c3",
      computerKey: "k",
      color: "white",
      active: false,
      keyPressed: false,
    },
  ]);

  const activeKey = synthKeys.find((key) => key.active);

  if (activeKey) {
    playNote(`./sounds/${currentInstrument}/${activeKey.keyName}.mp3`);
    setSynthKeys((prevKeys) =>
      prevKeys.map((key) =>
        key === activeKey ? { ...key, active: false } : key
      )
    );
  }

  function playNote(note) {
    let audio = new Audio(note);
    audio.volume = volume / 100;
    audio.playbackRate =
      playbackRate <= 10 ? playbackRate / 10 : playbackRate - 9;
    audio.loop = loop;
    audio.play();
    loop && setLoopingNotes([...loopingNotes, audio]);
  }

  const handleMouseDown = (keyName) => {
    setSynthKeys((prevKeys) =>
      prevKeys.map((key) =>
        key.keyName === keyName ? { ...key, active: true } : key
      )
    );
    playNote(`./sounds/${currentInstrument}/${keyName}.mp3`);
  };

  const handleMouseUp = (keyName) => {
    setSynthKeys((prevKeys) =>
      prevKeys.map((key) =>
        key.keyName === keyName ? { ...key, active: false } : key
      )
    );
  };

  const handleKeyDown = (event) => {
    const key = synthKeys.find((key) => key.computerKey === event.key);
    if (key) {
      setSynthKeys((prevKeys) =>
        prevKeys.map((k) =>
          k.keyName === key.keyName
            ? { ...k, active: true, keyPressed: true }
            : k
        )
      );
      playNote(`./sounds/${currentInstrument}/${key.keyName}.mp3`);
    }
  };

  const handleKeyUp = (event) => {
    const key = synthKeys.find((key) => key.computerKey === event.key);
    if (key) {
      setSynthKeys((prevKeys) =>
        prevKeys.map((k) =>
          k.keyName === key.keyName
            ? { ...k, active: false, keyPressed: false }
            : k
        )
      );
    }
  };

  const propsBundle = {
    currentInstrument,
    setCurrentInstrument,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    loop,
    setLoop,
    loopingNotes,
    setLoopingNotes,
    showKeys,
    setShowKeys,
  };

  /* Challenge

	Bu synth klavyede önemli bir şey henüz çalışmıyor: Tuşlar. Göreviniz, kullanıcının tuşları mouse tuşu ya da bilgisayar klavyesi ile aşağıdaki şekilde oynatmasına izin vermektir:  
	
		1. Bir kullanıcı mouse tuşu veya bilgisayar tuşu ile bir synth tuşu çaldığında, synthKeys state array içinde synth tuşunun ilgili nesnesinin active özelliği true olarak ayarlanmalıdır. 
		   
				   - Bir synth tuşunun mouse tuşu ile çalınması, synth tuşu üzerinde mouse tuşunun basılı tutulması (*tıklanmaması*) anlamına gelir. 
					 
				   - Bir synth tuşunu bir bilgisayar tuşuyla çalmak, synthKeys state dizisindeki synth tuşunun karşılık gelen computerKey özelliği tarafından tanımlandığı gibi, ona karşılık gelen bilgisayar tuşuna basmak anlamına gelir. 
				
		2. Kullanıcı bir bilgisayar tuşuna basarak bir synth tuşunu çalarsa, synth tuşunun synthKeys state array'deki karşılık gelen nesnesinin keyPressed özelliği de true olarak ayarlanmalıdır. Kullanıcı bilgisayar tuşunu kaldırdığında, keyPressed özelliği tekrar false olarak ayarlanmalıdır. 
		   
		3. Nesnenin diğer tüm özellikleri ve synthKeys state array'deki diğer tüm nesneler, state her güncellendiğinde korunmalıdır. Yalnızca hedeflenen nesnenin active özelliği ve (varsa) keyPressed özelliği değiştirilmelidir. 

		4. Görevi tamamlamak için yalnızca aşağıdaki üç olay işleyicisi için kod yazmalısınız. Projenin başka hiçbir yerinde başka bir kod değiştirilmemeli veya eklenmemelidir. Görevi bitirmeden önce key'lerde hata olup olmadığını da kontrol etmelisiniz. Bir kullanıcının onunla nasıl etkileşime gireceğini simüle etmek için üzerinde biraz müzik çalın. 
		   
		Not: QWERTY olmayan bir klavyeniz varsa, synthKey state dizisindeki computerKey özelliklerini klavye düzeniniz için daha anlamlı olan bilgisayar tuşlarıyla değiştirebilirsiniz

		İpucu: "main-container" div'ine onClick={(e)=>console.log(e.target)} ekleyin ve altta yatan DOM'u tanımak için tuşlara tıklayın ya da bileşenler klasöründeki Keys bileşenine bakın.  

				Saldırı Planı:
				
			2. Olayları yorumlayın
				- Ne tür bir olay? 
				- Olay synthkey state nesnelerinden birine karşılık geliyor mu? 
				- Eğer öyleyse, hangisi? (Buna hedef nesne deyin.)
				
			3. synthKeys state dizisini güncelleyin. 
				- Hedef nesneyi güncelleyin. 
					- mouseDown veya keyDown -> hedef nesnenin active özelliği = true 
					- keyDown -> ayrıca -> hedef nesnenin keyPressed özelliği = true 
					- keyUp -> hedef nesnenin keyPressed özelliği = false 

*/

  return (
    <div
      className="wrapper"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
      <div className="main-container">
        <Settings {...propsBundle} />
        <Keys
          showKeys={showKeys}
          synthKeys={synthKeys}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
}
