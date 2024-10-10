import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-red-500 mr-2" />
          )}
          <span className={item.met ? "text-green-500" : "text-red-400"}>
            {item.label}
          </span>
        </div>
        
      ))}
    </div>
  );
};

export const validatePassword = (password) => {
  const criteria = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  if (criteria.filter((c) => c).length === 5) {
    return true;
  } else {
    return false;
  }
};

const PasswordStrengthMeter = ({ password }) => {
  return (
    <div className="">
      {/* <span className="text-xs text-cyan-400">Password strength</span> */}
      <PasswordCriteria password={password} />
    </div>
  );
};
export default PasswordStrengthMeter;
