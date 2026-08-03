/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SiteLock from "./components/SiteLock/SiteLock";  
import { ActiveScene } from './types';
import { Scene1Container } from './components/Scene1Intro/Scene1Container';
import { VaultContainer } from './components/Scene2Vault/VaultContainer';
import { Scene3Container } from './components/Scene3FloatingMemories/Scene3Container';
import { VideoMessageScene } from './components/VideoMessage/VideoMessageScene';
import { LivingLetterScene } from './components/LivingLetter/LivingLetterScene';
import { FriendshipCertificateScene } from './components/Certificate/FriendshipCertificateScene';
import { FriendshipPromiseScene } from './components/Scene10Promise/FriendshipPromiseScene';
import { TwoQuestionsScene } from './components/Scene11TwoQuestions/TwoQuestionsScene';
import { ConditionalResultScene } from './components/Scene12ConditionalResult/ConditionalResultScene';
import { FinaleScene } from './components/Scene13Finale/FinaleScene';
import { NavigationOverlay } from './components/NavigationOverlay';
// import { JourneyTimeline } from './components/common/JourneyTimeline';
import { memoryPoolService } from './utils/memoryPool';

export default function App() {

  const [unlocked, setUnlocked] = useState(false);

useEffect(() => {
  if (sessionStorage.getItem("siteUnlocked") === "true") {
    setUnlocked(true);
  }
}, []);
  const [activeScene, setActiveScene] = useState<ActiveScene>('SCENE_1');
  const [answers, setAnswers] = useState<{ answer1: 'YES' | 'NO'; answer2: 'YES' | 'NO' }>({
    answer1: 'YES',
    answer2: 'YES',
  });

  const handleScene1Complete = () => {
    setActiveScene('SCENE_2');
  };

  const handleScene2Complete = () => {
    setActiveScene('SCENE_3');
  };

  const handleScene3Complete = () => {
    setActiveScene('SCENE_4');
  };

  const handleScene4Complete = () => {
    setActiveScene('SCENE_5');
  };

  const handleScene5Complete = () => {
    setActiveScene('SCENE_6');
  };

  const handleScene6Complete = () => {
    setActiveScene('SCENE_7');
  };

  const handleScene7Complete = () => {
    setActiveScene('SCENE_8');
  };

  const handleScene8Complete = () => {
    setActiveScene('SCENE_9');
  };

  const handleScene9Complete = () => {
    setActiveScene('SCENE_10');
  };

  const handleScene10Complete = () => {
    setActiveScene('SCENE_11');
  };

  const handleScene11Complete = (ans1: 'YES' | 'NO', ans2: 'YES' | 'NO') => {
    setAnswers({ answer1: ans1, answer2: ans2 });
    setActiveScene('SCENE_12');
  };

  const handleScene12Complete = () => {
    setActiveScene('SCENE_13');
  };

  const handleRestartJourney = () => {
    // Reshuffle pools and restart journey
    memoryPoolService.resetSession();
    setActiveScene('SCENE_1');
  };
  if (!unlocked) {
  return (
    <SiteLock
      onUnlock={() => setUnlocked(true)}
    />
  );
}

  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative">
      <NavigationOverlay
        activeScene={activeScene}
        onSelectScene={(scene) => setActiveScene(scene)}
      />

      {/* <JourneyTimeline
        activeScene={activeScene}
        onSelectScene={(scene) => setActiveScene(scene)}
      /> */}

      {activeScene === 'SCENE_1' && (
        <Scene1Container onSceneComplete={handleScene1Complete} />
      )}

      {activeScene === 'SCENE_2' && (
        <VaultContainer onScene2Complete={handleScene2Complete} />
      )}

      {activeScene === 'SCENE_3' && (
        <Scene3Container onScene3Complete={handleScene3Complete} />
      )}

      {activeScene === 'SCENE_4' && (
        <VideoMessageScene
          sceneId="SCENE_4"
          headerPrefix="SHORT DESCRIPTION OF US FROM"
          recipientName="MS"
          lockQuestion="Which Name Best Describe Us ?"
          correctAnswer="Best Friends"
          videoUrl="/videos/ms.mp4"
          chapterBadge="CHAPTER 04 • FROM MS"
          onComplete={handleScene4Complete}
        />
      )}

      {activeScene === 'SCENE_5' && (
        <VideoMessageScene
          sceneId="SCENE_5"
          headerPrefix="SHORT DESCRIPTION OF US FROM"
          recipientName="MINIEE"
          lockQuestion="How Long Do We Want To Keep This Relation ?"
          correctAnswer="Forever"
          videoUrl="/videos/miniiee.mp4"
          chapterBadge="CHAPTER 05 • FROM MINIEE"
          onComplete={handleScene5Complete}
        />
      )}

      {activeScene === 'SCENE_6' && (
        <LivingLetterScene
          sceneId="SCENE_6"
          author="MS"
          recipient="MINIEE"
          authorTitle="A SPECIAL MESSEGE FOR MINIEE"
          chapterBadge="CHAPTER 06 • LETTER FROM MS"
          defaultContent="Hello dearest Miniiee....🩷
Happy Friendship Day Mate 🤗....
Is friendship ke maayne shbdo me bayan karna.....thoda sa mushkil toh hai hi .......
Because this is precious......it started from uske life me dusre log hai but mai iski achchhi dost hu ..... to Miniiee meri sabse achchhi dost hai ..... Dost kaafi saare hai.....but first thought to do something, do share something, to irritate is with you.....no doubt...mind didn't even take a moment to remind your name 🤗.......
And tuze jarurat thi meri, ya tu sirf ladki hai isliye tu achchhi dost ban gayi ( normally boys have that perception )......not at all.....you have taken lot of efforts to earn this.....and still you're taking efforts to maintain that.....and calling you as my Best Friend is pride for me actually!!!❣️....
Handling me is such a tedious task.....there are very few people who can handling me and I'm like very unfiltered to them.....like nobody has ever seen me angry except my very close people and you're effectively one of them.....who's stayed constant since I meant nothing to you......💖.
....
They say life will teach you a lesson....and life taught you and me as well.....that you never know and people will use you whom you loved most.....but also life offered both of us....a strong circle of good friends.....and for me you're centre of that.....I can be wandering everywhere... but always come to you.... connected to you 🩷....
Many situations/incidents tried us to detach.....and we also were firm to cut off....but hardly one day we can hold our anger.....next we're ...kar deta/deti hu msg....sort kar lete hai bhai...itna thodi kuch hua ki Mai isase dur jaau 😄🩷....
You know you won't do this for me only..... you're very tied up with all of your friends......and that's your speciality.....but for me....I'm grateful to you for this 💙....
I may not be the best..... you have so many better friends than me .....but I got always more than I deserve from your side.....nd this is what I'm always grateful to you....and this is the reason I feel very guilty when we fight and say let's leave....no!!!!!!!!!...
I owe you for these things.....I have debt of your efforts, your friendship....and I can't repay it lifelong forever....so I can't let go from it simply by any way.....🥺
And Moreover..... Love you soooooo much Miniiee....🤍.....
Sang rahiyo...... These words only cannot describe the love, care I have for you....but this is the only way to convey it at this time..... occasionally I'll prove it also.....
And one request from.my side... recently you said...you need to think ....how can you express to me.....so I assure you that no obstacles will happen from my side.... that'll make you think this......and you can literally tell me anything you feel.... without any hesitation and tension.....I'm always here to listen...listen calmly!!!!! 
And will try to be the better friend of yours....🩷
.
Once again Happy Friendship Day 🥰🫶🏻....
And *Let's Make it Forever ♾️❣️*
..
.
.


*****Note :- Thank you so much for your video.....🤍...I really loved it.....the implication and the scope was hilarious and thoughtful....Very very thank you and love you Mintyaa 🥰🫶🏻🤗....
.
.
.
Minieeee.......
Khushi me toh sabhi khate hai gujarati, marathi, Chinese, Cheese toast....., 
Khushiiiiii .....me toh sabhi khate hai gujarati, marathi, Chinese, Cheese toast.....,
....
Jiski har samay yaad aaye....aur jo yaad aane par aa bhi jaaye....wahi hota hai asli dost....!!!! 
Wahi hota haiiiiiii Asli Dost........! 🥹"
          canEdit={true}
          onComplete={handleScene6Complete}
        />
      )}

      {activeScene === 'SCENE_7' && (
        <LivingLetterScene
          sceneId="SCENE_7"
          author="MINIEE"
          recipient="MS"
          authorTitle="A Response Letter From MINIEE"
          chapterBadge="CHAPTER 07 • LETTER FROM MINIEE"
          defaultContent="Finally..... Friendship day mera pura hua....😊😊
Jab tak tera msg nahi aata.....lag hi nahi raha tha....

Thank you so so so much for this fulfilling msg yaar!!!

Love u buddy🩷

Bas ek baat.....aage se jhagdenge...but ego ko side mein rakh denge!!"
          canEdit={true}
          onComplete={handleScene7Complete}
        />
      )}

      {activeScene === 'SCENE_8' && (
        <FriendshipCertificateScene
          sceneId="SCENE_8"
          chapterBadge="CHAPTER 08 • AWARD FOR BEST FRIEND"
          title="Official Recognition of a Bond Meant to Last a Lifetime"
          awardName="Certificate of Eternal Friendship"
          presenter="MS"
          recipient="Miniiee"
          signerName="MS"
          bodyText="Awarded in recognition of an extraordinary friendship founded upon unwavering trust, unconditional support, genuine love, heartfelt care, mutual respect, and enduring loyalty. This certificate celebrates a bond that transcends time, distance, and life's countless challenges, honoring two hearts that continue to choose one another with kindness, understanding, and unwavering faith. May this friendship remain a lasting source of strength, comfort, laughter, inspiration, and cherished memories, forever standing as a timeless symbol of a connection that neither time nor circumstance can ever diminish."
          canSign={true}
          onComplete={handleScene8Complete}
        />
      )}

      {activeScene === 'SCENE_9' && (
        <FriendshipCertificateScene
          sceneId="SCENE_9"
          chapterBadge="CHAPTER 09 • AWARD FOR MS"
          title="Official Recognition of a Bond Meant to Last a Lifetime"
          awardName="Certificate of Eternal Friendship"
          presenter="MINIEE"
          recipient="MS"
          signerName="MINIEE"
          bodyText="Awarded in recognition of an extraordinary friendship founded upon unwavering trust, unconditional support, genuine love, heartfelt care, mutual respect, and enduring loyalty. This certificate celebrates a bond that transcends time, distance, and life's countless challenges, honoring two hearts that continue to choose one another with kindness, understanding, and unwavering faith. May this friendship remain a lasting source of strength, comfort, laughter, inspiration, and cherished memories, forever standing as a timeless symbol of a connection that neither time nor circumstance can ever diminish."
          canSign={true}
          onComplete={handleScene9Complete}
        />
      )}

      {activeScene === 'SCENE_10' && (
        <FriendshipPromiseScene
          chapterBadge="CHAPTER 10 • THE FRIENDSHIP PROMISE"
          title="Our Sacred Friendship Promise"
          promiseParagraph="By accepting this Eternal Friendship Promise, we willingly commit ourselves to a bond founded upon unwavering trust, unconditional support, genuine love, heartfelt care, mutual respect, lasting affection, and lifelong loyalty. We promise to encourage one another's dreams, stand together through every triumph and every challenge, protect each other's confidence, celebrate every achievement, and offer comfort in moments of uncertainty. We choose understanding over judgment, honesty over silence, forgiveness over pride, and unity over distance. No matter how life changes or where our paths may lead, this promise shall forever serve as a symbol of a friendship that remains strong, meaningful, and unbreakable—a bond carried not merely by time, but by two hearts that never stop believing in one another."
          personAName="MS"
          personBName="MINIEE"
          onComplete={handleScene10Complete}
        />
      )}

      {activeScene === 'SCENE_11' && (
        <TwoQuestionsScene
          chapterBadge="CHAPTER 11 • THE TWO QUESTIONS"
          personAName="MS"
          personBName="MINIEE"
          onComplete={handleScene11Complete}
        />
      )}

      {activeScene === 'SCENE_12' && (
        <ConditionalResultScene
          chapterBadge="CHAPTER 12 • THE RESULT"
          answer1={answers.answer1}
          answer2={answers.answer2}
          yesYesMessage="What a beautiful reflection of your friendship. The feelings of care, appreciation, and affection are shared equally between both hearts, making this bond truly special. Continue to nurture it with trust, honesty, respect, kindness, and unwavering support. Celebrate each other's victories, stand together through every challenge, and never stop choosing this friendship. May your connection grow stronger with every passing day, creating countless unforgettable memories and remaining a lifelong source of happiness, comfort, and inspiration. Here's to a friendship that continues to flourish today, tomorrow, and forever. True friendship is not about never facing differences—it's about always finding a reason to stay."
          noNoMessage="Every meaningful friendship grows through understanding, patience, and the willingness to meet each other halfway. A difference in feelings today does not define the future of your bond—it simply reminds you that every great friendship requires time, communication, and genuine effort from both sides. Continue supporting one another, expressing appreciation, and creating beautiful memories together. With honesty, respect, compassion, and a little extra effort, today's uncertainty can become tomorrow's strongest connection. The most extraordinary friendships are built not because everything is perfect, but because both hearts choose to keep growing together. True friendship is not about never facing differences—it's about always finding a reason to stay."
          mixedMessage="Every lasting friendship begins with a choice, and every challenge is an opportunity to build something stronger than before. Whatever distance, misunderstanding, or silence may exist today does not have to define your journey together. Take small steps, listen with an open heart, show kindness without expecting anything in return, and never underestimate the power of sincere effort. Trust can be rebuilt, respect can grow deeper, and beautiful memories can still be created. This is not the end of your story—it is simply the beginning of a stronger, healthier, and more meaningful friendship waiting to be written together. True friendship is not about never facing differences—it's about always finding a reason to stay."
          onComplete={handleScene12Complete}
        />
      )}

      {activeScene === 'SCENE_13' && (
  <div className="absolute inset-0 overflow-y-auto">
    <FinaleScene
      chapterBadge="CHAPTER 13 • FOREVER BEGINS HERE"
      finaleSentence="Every laugh we shared,
every tear we wiped away,
every promise we kept,
every silent moment we understood,
has become a memory that time can never erase.

No matter where life takes us,
our friendship will always remain a place
we can call home."
      onRestartJourney={handleRestartJourney}
    />
  </div>
)}
    </main>
  );
}
