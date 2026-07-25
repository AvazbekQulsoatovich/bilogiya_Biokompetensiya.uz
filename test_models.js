const ids = [
  "933f7c1626f24da0bbce010ff7343e06",
  "15f9d14ec8fc4157a3e7ef9eeb6f1e82", 
  "a0f2b3e8e19b4b0eb140c8227b72db7f",
  "93297a7a58a7419fa70daecfc662586e"
];

async function check() {
  for (const id of ids) {
    const res = await fetch(`https://sketchfab.com/models/${id}/embed`);
    console.log(`${id}: ${res.status}`);
  }
}

check();
