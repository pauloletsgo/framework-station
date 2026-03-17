import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { HomePage } from "@/pages/home";
import { SwotPage } from "@/pages/swot";
import { AnsoffPage } from "@/pages/ansoff";
import { BcgPage } from "@/pages/bcg";
import { PorterPage } from "@/pages/porter";
import { UspPage } from "@/pages/usp";
import { GoldenCirclePage } from "@/pages/golden-circle";
import { BusinessModelCanvasPage } from "@/pages/business-model-canvas";
import { TierCreatorPage } from "@/pages/tier-creator";
import { NotFoundPage } from "@/pages/not-found";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/swot" component={SwotPage} />
        <Route path="/ansoff" component={AnsoffPage} />
        <Route path="/bcg" component={BcgPage} />
        <Route path="/porter" component={PorterPage} />
        <Route path="/usp" component={UspPage} />
        <Route path="/golden-circle" component={GoldenCirclePage} />
        <Route path="/business-model-canvas" component={BusinessModelCanvasPage} />
        <Route path="/tier-creator" component={TierCreatorPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
