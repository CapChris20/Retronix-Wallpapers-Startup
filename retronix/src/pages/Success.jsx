import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

function Success() {
  const [params] = useSearchParams();

  useEffect(() => {
    const tier = params.get("tier");
    const user = auth.currentUser;

    if (user && tier) {
      setDoc(doc(db, "users", user.uid), { subscription: tier }, { merge: true });
    }
  }, [params]);

  return (
    <div className="success-page">
      <h1>🎉 Subscription Complete!</h1>
      <p>Thank you for subscribing.</p>
    </div>
  );
}

export default Success;