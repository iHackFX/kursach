import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  pieChartOutline,
  settingsOutline,
  walletOutline,
} from "ionicons/icons";
import MyMoney from "./pages/MyMoney";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import StartPage from "./components/StartPage";
import { useState } from "react";

const App: React.FC = () => {
  const [showStartPage, setShowStartPage] = useState(true);
  return (
    <IonApp>
      <StartPage setShowModal={setShowStartPage} showModal={showStartPage} />
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/my-money">
              <MyMoney showStartPage={showStartPage} />
            </Route>
            <Route exact path="/statistics">
              <Statistics />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/my-money" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="myMoney" href="/my-money">
              <IonIcon icon={walletOutline} />
              <IonLabel>Мои деньги</IonLabel>
            </IonTabButton>
            <IonTabButton tab="statistics" href="/statistics">
              <IonIcon icon={pieChartOutline} />
              <IonLabel>Статистика</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Настройки</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
