import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/spy1710/mood-music/songs/A_Flying_Jatt__Title_Track__PagalWorld.com_KBbBCHLMi.mp3",
    posterUrl:
      "https://ik.imagekit.io/spy1710/mood-music/posters/A_Flying_Jatt__Title_Track__PagalWorld.com_ShqkEs6yW.jpeg",
    title: "A Flying Jatt (Title Track) PagalWorld.com",
    artist: "Raftaar, Mansheel Gujaral , Tanishkaa - PagalWorld.com",
    album: "A Flying Jatt (2016) PagalWorld.com",
    year: "2016",
    mood: "surprised",
  });

  const [loading, setLoading] = useState(false);
  return (
    <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
      {children}
    </SongContext.Provider>
  );
};
