const BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

function uniqueEmail() {
  return `demo_${Date.now()}@example.com`;
}

async function request(method, path, body, token) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const raw = await response.text();
  let data = raw;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    // Keep plain-text responses as-is.
  }

  return {
    status: response.status,
    ok: response.ok,
    data
  };
}

function printStep(title, result) {
  console.log(`\n=== ${title} ===`);
  console.log(`Status: ${result.status}`);
  console.log(JSON.stringify(result.data, null, 2));
}

async function main() {
  const email = uniqueEmail();
  const password = "password123";
  const studentPayload = {
    name: "Juan Dela Cruz",
    course: "BSIT"
  };

  console.log(`Running API demo against ${BASE_URL}`);
  console.log(`Using test account: ${email}`);

  const register = await request("POST", "/api/auth/register", {
    email,
    password
  });
  printStep("Register", register);

  const login = await request("POST", "/api/auth/login", {
    email,
    password
  });
  printStep("Login", login);

  if (!login.ok || !login.data || !login.data.token) {
    throw new Error("Login failed, cannot continue with protected student routes.");
  }

  const token = login.data.token;

  const createStudent = await request("POST", "/api/students", studentPayload, token);
  printStep("Create Student", createStudent);

  const studentId = createStudent.data && createStudent.data._id;
  if (!studentId) {
    throw new Error("Student creation did not return an _id.");
  }

  const getAll = await request("GET", "/api/students", null, token);
  printStep("Get All Students", getAll);

  const getOne = await request("GET", `/api/students/${studentId}`, null, token);
  printStep("Get One Student", getOne);

  const updateStudent = await request("PUT", `/api/students/${studentId}`, {
    course: "BSCS"
  }, token);
  printStep("Update Student", updateStudent);

  const deleteStudent = await request("DELETE", `/api/students/${studentId}`, null, token);
  printStep("Delete Student", deleteStudent);

  const finalList = await request("GET", "/api/students", null, token);
  printStep("Get All Students After Delete", finalList);

  console.log("\nAPI demo finished.");
}

main().catch((error) => {
  console.error("\nAPI demo failed:");
  console.error(error.message);
  process.exitCode = 1;
});
