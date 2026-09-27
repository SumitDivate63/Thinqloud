// Test script to verify customClaims structure for both test accounts
const ADMIN_EMAIL = 'sumitdivate3@gmail.com';

function getCustomClaimsForEmail(email) {
  const normEmail = (email || '').toLowerCase();
  const role = normEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
  return {
    role,
    isAdmin: role === 'admin'
  };
}

const testUsers = [
  { displayName: 'Jordan Blake', email: 'jordan.blake@thinqsummit.io' },
  { displayName: 'Sumit Divate (Admin)', email: 'sumitdivate3@gmail.com' }
];

console.log("=================================================");
console.log("FIREBASE AUTH CUSTOM CLAIMS RESOLUTION TEST RESULT");
console.log("=================================================\n");

testUsers.forEach(u => {
  const claims = getCustomClaimsForEmail(u.email);
  console.log(`User: ${u.displayName} (${u.email})`);
  console.log(`Verified customClaims: ${JSON.stringify(claims, null, 2)}\n`);
});
